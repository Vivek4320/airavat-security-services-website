'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FileText, UserPlus, Users, ShieldCheck, X, ArrowLeft, LogOut, ChevronRight } from 'lucide-react';

type Guard = {
  id: string;
  name: string;
  contact: string;
  age: number;
  oldExperience: string;
  payment: string;
  address: string;
  shift: string;
  remarks: string | null;
  permanentWork: boolean;
  temporaryWork: boolean;
  createdAt: string;
};

const emptyForm = {
  name: '', contact: '', age: '', oldExperience: '', payment: '',
  address: '', shift: 'Day shift', remarks: '', permanentWork: false, temporaryWork: false,
};

export default function DashboardClient() {
  const router = useRouter();
  const [view, setView] = useState<'home' | 'registration'>('home');
  const [guards, setGuards] = useState<Guard[]>([]);
  const [showGuards, setShowGuards] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadGuards = async () => {
    const res = await fetch('/api/guards/list');
    if (res.ok) setGuards((await res.json()).guards);
  };

  useEffect(() => { loadGuards(); }, []);

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/guards/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('Guard registered successfully');
      setForm(emptyForm);
      await loadGuards();
      setView('home');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Registration failed');
    } finally { setSaving(false); }
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] text-[#101828]">
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <button onClick={() => setView('home')} className="flex items-center gap-3">
            <Image src="/logo.png" alt="AIRAVAT" width={52} height={52} className="object-contain" />
            <div className="text-left"><div className="text-xl font-bold text-[#040936]">AIRAVAT</div><div className="text-[10px] tracking-wider text-gray-500">SECURITY SERVICE</div></div>
          </button>
          <button onClick={async () => { await fetch('/api/auth/logout',{method:'POST'}); router.push('/admin/login'); }} className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold hover:bg-gray-50"><LogOut size={16}/> Logout</button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        {view === 'home' ? (
          <>
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-widest text-[#040936]">Management Portal</p>
              <h1 className="mt-2 text-3xl font-bold text-[#040936]">Operations Dashboard</h1>
              <p className="mt-2 text-gray-600">Manage guard registrations and invoices from one place.</p>
            </div>

            <section className="grid gap-5 md:grid-cols-2">
              <button onClick={() => setView('registration')} className="group rounded-2xl border border-gray-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#040936] text-white"><UserPlus size={23}/></div>
                <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Guard Registration</h2><p className="mt-1 text-sm text-gray-500">Register a new security guard.</p></div><ChevronRight className="text-gray-400 transition group-hover:translate-x-1"/></div>
              </button>
              <button onClick={() => setShowGuards(true)} className="group rounded-2xl border border-gray-200 bg-white p-7 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#dec3a0] text-[#040936]"><Users size={23}/></div>
                <div className="flex items-center justify-between"><div><h2 className="text-xl font-bold">Guard List</h2><p className="mt-1 text-sm text-gray-500">{guards.length} registered guard{guards.length === 1 ? '' : 's'} · View profiles</p></div><ChevronRight className="text-gray-400 transition group-hover:translate-x-1"/></div>
              </button>
              <div className="rounded-2xl border border-gray-200 bg-[#040936] p-7 text-white md:col-span-2">
                <div className="flex items-center gap-3"><FileText/><div><h2 className="text-xl font-bold">Invoice Generator</h2><p className="mt-1 text-sm text-white/70">Invoice generator section reserved for the next module.</p></div></div>
              </div>
            </section>

            {showGuards && <GuardListModal guards={guards} onClose={() => setShowGuards(false)} />}
          </>
        ) : (
          <section className="mx-auto max-w-4xl">
            <button onClick={() => setView('home')} className="mb-5 flex items-center gap-2 text-sm font-semibold text-[#040936]"><ArrowLeft size={17}/> Back to Dashboard</button>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
              <div className="mb-8 flex items-start gap-4"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#040936] text-white"><ShieldCheck/></div><div><h1 className="text-2xl font-bold text-[#040936]">Guard Registration</h1><p className="text-sm text-gray-500">Add guard details to the security staff database.</p></div></div>
              <form onSubmit={submitRegistration} className="grid gap-5 md:grid-cols-2">
                <Field label="Name" value={form.name} onChange={v=>setForm({...form,name:v})} required/>
                <Field label="Contact" type="tel" value={form.contact} onChange={v=>setForm({...form,contact:v})} required/>
                <Field label="Age" type="number" value={form.age} onChange={v=>setForm({...form,age:v})} required/>
                <Field label="Old Experience" value={form.oldExperience} onChange={v=>setForm({...form,oldExperience:v})} placeholder="e.g. 3 years"/>
                <Field label="Payment" value={form.payment} onChange={v=>setForm({...form,payment:v})} placeholder="e.g. ₹18,000 / month"/>
                <label className="block"><span className="mb-2 block text-sm font-semibold">Day shift / Night shift</span><select value={form.shift} onChange={e=>setForm({...form,shift:e.target.value})} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#040936]"><option>Day shift</option><option>Night shift</option></select></label>
                <label className="block md:col-span-2"><span className="mb-2 block text-sm font-semibold">Address</span><textarea required value={form.address} onChange={e=>setForm({...form,address:e.target.value})} rows={3} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#040936]" /></label>
                <label className="block md:col-span-2"><span className="mb-2 block text-sm font-semibold">Remarks</span><textarea value={form.remarks} onChange={e=>setForm({...form,remarks:e.target.value})} rows={3} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#040936]" /></label>
                <div className="md:col-span-2 grid gap-3 sm:grid-cols-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4"><input type="checkbox" checked={form.permanentWork} onChange={e=>setForm({...form,permanentWork:e.target.checked})}/><span><b>Permanent work</b><small className="block text-gray-500">Available for permanent assignment</small></span></label>
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border p-4"><input type="checkbox" checked={form.temporaryWork} onChange={e=>setForm({...form,temporaryWork:e.target.checked})}/><span><b>Temporary work</b><small className="block text-gray-500">Available for temporary assignment</small></span></label>
                </div>
                <div className="md:col-span-2 flex justify-end gap-3 border-t pt-5"><button type="button" onClick={()=>setView('home')} className="rounded-xl border px-5 py-3 font-semibold">Cancel</button><button disabled={saving} className="rounded-xl bg-[#040936] px-6 py-3 font-semibold text-white disabled:opacity-50">{saving ? 'Registering...' : 'Register Guard'}</button></div>
              </form>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Field({label,value,onChange,type='text',placeholder,required=false}:{label:string;value:string;onChange:(v:string)=>void;type?:string;placeholder?:string;required?:boolean}) {
 return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span><input required={required} type={type} value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-[#040936] focus:ring-2 focus:ring-[#040936]/10"/></label>;
}

function GuardListModal({guards,onClose}:{guards:Guard[];onClose:()=>void}) {
 return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
   <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl" onClick={e=>e.stopPropagation()}>
     <div className="flex items-center justify-between border-b px-6 py-5"><div><h2 className="text-xl font-bold text-[#040936]">Registered Guards</h2><p className="text-sm text-gray-500">Click a guard to view complete profile details.</p></div><button onClick={onClose} className="rounded-lg p-2 hover:bg-gray-100"><X/></button></div>
     <div className="max-h-[calc(90vh-100px)] overflow-y-auto p-6">
       {guards.length === 0 ? <div className="py-16 text-center text-gray-500">No guards registered yet.</div> : <div className="grid gap-4 md:grid-cols-2">{guards.map(g=><div key={g.id} className="rounded-xl border border-gray-200 p-5 hover:border-[#040936]/30 hover:shadow-md"><div className="flex items-start justify-between"><div><h3 className="font-bold text-lg">{g.name}</h3><p className="text-sm text-gray-500">{g.contact}</p></div><span className="rounded-full bg-[#040936]/10 px-3 py-1 text-xs font-semibold text-[#040936]">{g.shift}</span></div><div className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><span className="text-gray-500">Age</span><p className="font-medium">{g.age}</p></div><div><span className="text-gray-500">Experience</span><p className="font-medium">{g.oldExperience}</p></div><div><span className="text-gray-500">Payment</span><p className="font-medium">{g.payment}</p></div><div><span className="text-gray-500">Work</span><p className="font-medium">{g.permanentWork ? 'Permanent' : ''}{g.permanentWork && g.temporaryWork ? ' + ' : ''}{g.temporaryWork ? 'Temporary' : '' || '—'}</p></div></div><div className="mt-4 border-t pt-3 text-sm"><span className="text-gray-500">Address</span><p>{g.address}</p></div>{g.remarks && <div className="mt-3 text-sm"><span className="text-gray-500">Remarks</span><p>{g.remarks}</p></div>}</div>)}</div>}
     </div>
   </div>
 </div>;
}
