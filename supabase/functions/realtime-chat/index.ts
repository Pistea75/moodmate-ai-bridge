import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RealtimeEvent {
  type: string;
  [key: string]: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const { headers } = req;
  const upgradeHeader = headers.get("upgrade") || "";

  if (upgradeHeader.toLowerCase() !== "websocket") {
    return new Response("Expected WebSocket connection", { status: 400 });
  }

  const authHeader = headers.get('authorization');
  const apikey = headers.get('apikey');
  
  if (!authHeader || !apikey) {
    return new Response('Unauthorized', { status: 401 });
  }

  // Initialize Supabase client for authentication
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Verify user authentication
  const jwt = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
  
  if (authError || !user) {
    return new Response('Invalid authentication', { status: 401 });
  }

  console.log('🔐 Authenticated user:', user.id);

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  let openAISocket: WebSocket | null = null;
  let isConnected = false;

  // Connect to OpenAI Realtime API
  const connectToOpenAI = () => {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('❌ OPENAI_API_KEY not found');
      socket.send(JSON.stringify({ type: 'error', message: 'OpenAI API key not configured' }));
      return;
    }

    console.log('🔗 Connecting to OpenAI Realtime API...');
    
    openAISocket = new WebSocket(
      'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01',
      [],
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'OpenAI-Beta': 'realtime=v1'
        }
      }
    );

    openAISocket.onopen = () => {
      console.log('✅ OpenAI WebSocket connected');
      isConnected = true;
    };

    openAISocket.onmessage = async (event) => {
      try {
        const data: RealtimeEvent = JSON.parse(event.data);
        console.log('📨 OpenAI event:', data.type);

        // Handle session creation
        if (data.type === 'session.created') {
          console.log('🎉 Session created, sending configuration...');
          
          // Send session configuration with VAD and personalization
          const sessionUpdate = {
            type: 'session.update',
            session: {
              modalities: ['text', 'audio'],
              instructions: `You are a helpful AI assistant personalized for this user. Speak naturally and conversationally. Keep responses concise but helpful. You have access to user data through function calls when needed.`,
              voice: 'alloy',
              input_audio_format: 'pcm16',
              output_audio_format: 'pcm16',
              input_audio_transcription: {
                model: 'whisper-1'
              },
              turn_detection: {
                type: 'server_vad',
                threshold: 0.5,
                prefix_padding_ms: 300,
                silence_duration_ms: 1000
              },
              tools: [
                {
                  type: 'function',
                  name: 'get_user_profile',
                  description: 'Get user profile information and personalization data',
                  parameters: {
                    type: 'object',
                    properties: {
                      user_id: { type: 'string' }
                    },
                    required: ['user_id']
                  }
                }
              ],
              tool_choice: 'auto',
              temperature: 0.8,
              max_response_output_tokens: 'inf'
            }
          };

          openAISocket?.send(JSON.stringify(sessionUpdate));
        }

        // Handle function calls
        if (data.type === 'response.function_call_arguments.done') {
          console.log('🔧 Function call:', data.name, data.arguments);
          
          if (data.name === 'get_user_profile') {
            try {
              // Get user profile from Supabase
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();
              
              const functionResponse = {
                type: 'conversation.item.create',
                item: {
                  type: 'function_call_output',
                  call_id: data.call_id,
                  output: JSON.stringify(profile || { message: 'No profile found' })
                }
              };
              
              openAISocket?.send(JSON.stringify(functionResponse));
              openAISocket?.send(JSON.stringify({ type: 'response.create' }));
            } catch (error) {
              console.error('❌ Function call error:', error);
              const errorResponse = {
                type: 'conversation.item.create',
                item: {
                  type: 'function_call_output',
                  call_id: data.call_id,
                  output: JSON.stringify({ error: 'Failed to get user profile' })
                }
              };
              openAISocket?.send(JSON.stringify(errorResponse));
            }
          }
        }

        // Log conversation to database
        if (data.type === 'conversation.item.created') {
          if (data.item?.role === 'user' || data.item?.role === 'assistant') {
            let messageContent = '';
            
            if (data.item.content) {
              for (const content of data.item.content) {
                if (content.type === 'input_text' || content.type === 'text') {
                  messageContent = content.text || content.transcript || '';
                  break;
                }
              }
            }

            if (messageContent) {
              try {
                await supabase
                  .from('ai_chat_logs')
                  .insert({
                    patient_id: user.id,
                    role: data.item.role,
                    message: messageContent
                  });
                console.log('💾 Message logged to database');
              } catch (error) {
                console.error('❌ Failed to log message:', error);
              }
            }
          }
        }

        // Forward all events to client
        socket.send(event.data);
      } catch (error) {
        console.error('❌ Error processing OpenAI message:', error);
      }
    };

    openAISocket.onerror = (error) => {
      console.error('❌ OpenAI WebSocket error:', error);
      socket.send(JSON.stringify({ type: 'error', message: 'OpenAI connection error' }));
    };

    openAISocket.onclose = (event) => {
      console.log('🔌 OpenAI WebSocket closed:', event.code, event.reason);
      isConnected = false;
      socket.send(JSON.stringify({ type: 'openai_disconnected' }));
    };
  };

  socket.onopen = () => {
    console.log('🔌 Client WebSocket connected');
    connectToOpenAI();
  };

  socket.onmessage = (event) => {
    if (!isConnected || !openAISocket) {
      console.warn('⚠️ OpenAI not connected, buffering message');
      return;
    }

    try {
      const data = JSON.parse(event.data);
      console.log('📤 Forwarding to OpenAI:', data.type);
      openAISocket.send(event.data);
    } catch (error) {
      console.error('❌ Error forwarding message to OpenAI:', error);
    }
  };

  socket.onclose = () => {
    console.log('🔌 Client WebSocket closed');
    if (openAISocket) {
      openAISocket.close();
    }
  };

  socket.onerror = (error) => {
    console.error('❌ Client WebSocket error:', error);
    if (openAISocket) {
      openAISocket.close();
    }
  };

  return response;
});