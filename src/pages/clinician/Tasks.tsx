
'use client';

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client"; // Updated import
import ClinicianLayout from "@/layouts/ClinicianLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

const TasksPage = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    patient_id: ""
  });

  const fetchTasks = async () => {
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("tasks")
      .select("*, profiles:patient_id(first_name, last_name)")
      .eq("clinician_id", user.user?.id);

    if (error) console.error("Error fetching tasks", error);
    else setTasks(data || []);
  };

  const fetchPatients = async () => {
    const { data: user } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("patient_clinician_links")
      .select("patient_id, profiles:patient_id(first_name, last_name)")
      .eq("clinician_id", user.user?.id);

    if (error) console.error("Error fetching patients", error);
    else setPatients(data || []);
  };

  const handleCreateTask = async () => {
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from("tasks").insert({
      title: formData.title,
      description: formData.description,
      due_date: formData.due_date,
      completed: false,
      patient_id: formData.patient_id,
      clinician_id: user.user?.id
    });

    if (error) {
      console.error("Error creating task", error);
    } else {
      setFormData({ title: "", description: "", due_date: "", patient_id: "" });
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchPatients();
  }, []);

  const filteredTasks = tasks.filter((task) =>
    `${task.profiles.first_name} ${task.profiles.last_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <ClinicianLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Tasks</h1>
          <div className="flex gap-2">
            <Input
              placeholder="Filter by patient name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="default" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="space-y-4">
                  <Label>Title</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                  />
                  <Label>Assign to Patient</Label>
                  <select
                    className="w-full border rounded px-2 py-1"
                    value={formData.patient_id}
                    onChange={(e) => setFormData({ ...formData, patient_id: e.target.value })}
                  >
                    <option value="">Select a patient</option>
                    {patients.map((p) => (
                      <option key={p.patient_id} value={p.patient_id}>
                        {p.profiles.first_name} {p.profiles.last_name}
                      </option>
                    ))}
                  </select>
                  <Button onClick={handleCreateTask}>Create Task</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="p-4">
              <div className="flex items-start gap-4">
                <Checkbox checked={task.completed} className="mt-1" />
                <div className="flex-1">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {task.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Due: {format(new Date(task.due_date), 'yyyy-MM-dd')}
                    </span>
                    <span>•</span>
                    <span>
                      Patient: {task.profiles.first_name} {task.profiles.last_name}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </ClinicianLayout>
  );
};

export default TasksPage;
