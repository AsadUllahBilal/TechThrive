"use client";

import { Button } from '@/components/ui/button'
import { FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react'

const page = () => {
   const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Sending...");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
    } else {
      setStatus(`Failed: ${data.error}`);
    }
  }
  return (
    <section className='w-full min-h-[90vh] grid place-items-center'>
      <form className='w-[500px] p-6 rounded-md bg-[#222] flex flex-col gap-3' onSubmit={handleSubmit}>
        <h1 className='text-3xl font-bold'>Contact US</h1>
        <div className='flex flex-col gap-2'>
            <Label htmlFor='name'>Name:</Label>
            <Input id='name' placeholder='Enter Your Name' type='text' value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
        </div>
        <div className='flex flex-col gap-2'>
            <Label htmlFor='email'>Email:</Label>
            <Input id='email' placeholder='Enter Your Email' type='email' value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
        </div>
        <div className='flex flex-col gap-2'>
          <Label htmlFor='message'>Message:</Label>
          <Textarea id='message' placeholder='Enter Your Message' value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} />
        </div>
        <Button type='submit' className='w-full' variant={"navbarBtn"} size={"lg"}>Submit</Button>
        {status && <p>{status}</p>}
      </form>
    </section>
  )
}

export default page
