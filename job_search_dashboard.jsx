import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function JobSearchDashboard() {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('applications');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  const addApplication = () => {
    if (company && role) {
      const newApp = { company, role, status: status || 'Applied', date: new Date().toLocaleDateString() };
      setApplications([...applications, newApp]);
      setCompany('');
      setRole('');
      setStatus('');
    }
  };

  const exportCSV = () => {
    const headers = ['Company', 'Role', 'Status', 'Date'];
    const rows = applications.map(a => [a.company, a.role, a.status, a.date]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'applications.csv';
    link.click();
  };

  const jobSites = {
    Data: [
      ['Remotive', 'https://remotive.com/'],
      ['We Work Remotely', 'https://weworkremotely.com/'],
      ['Remote OK', 'https://remoteok.com/'],
      ['Otta', 'https://otta.com/'],
      ['AngelList (Wellfound)', 'https://wellfound.com/']
    ],
    Development: [
      ['Stack Overflow Jobs', 'https://stackoverflow.com/jobs'],
      ['Turing', 'https://www.turing.com/'],
      ['RemoteLeads', 'https://remoteleads.io/'],
      ['Himalayas', 'https://himalayas.app/']
    ],
    Research: [
      ['UX Jobs Board', 'https://uxjobsboard.com/'],
      ['Working Nomads', 'https://www.workingnomads.com/'],
      ['Contra', 'https://contra.com/'],
      ['Braintrust', 'https://www.usebraintrust.com/']
    ],
    Nonprofit: [
      ['UN Jobs', 'https://unjobs.org/'],
      ['Impactpool', 'https://www.impactpool.org/'],
      ['Devex', 'https://www.devex.com/jobs'],
      ['ReliefWeb', 'https://reliefweb.int/jobs'],
      ['Idealist', 'https://www.idealist.org/en/']
    ]
  };

  const openAllJobSites = () => {
    Object.values(jobSites).flat().forEach(([_, url]) => window.open(url, '_blank'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-blue-100 p-8">
      <motion.h1 className="text-4xl font-bold text-center mb-8 text-pink-600" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>🌸 Julia's Job Search Dashboard</motion.h1>
      <div className="grid md:grid-cols-2 gap-6">

        {/* Job Discovery Panel */}
        <Card className="shadow-lg bg-white/70 backdrop-blur-lg">
          <CardContent>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">🔍 Job Discovery</h2>
            <Button onClick={openAllJobSites} className="mb-4 w-full">🔗 Search All Job Sites</Button>
            {Object.entries(jobSites).map(([category, sites]) => (
              <div key={category} className="mb-4">
                <h3 className="font-medium text-lg mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {sites.map(([name, url]) => (
                    <Button key={name} variant="outline" onClick={() => window.open(url, '_blank')} className="text-sm">
                      {name}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Application Tracker */}
        <Card className="shadow-lg bg-white/70 backdrop-blur-lg">
          <CardContent>
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">📋 Application Tracker</h2>
            <div className="flex flex-col gap-2 mb-4">
              <Input placeholder="Company" value={company} onChange={e => setCompany(e.target.value)} />
              <Input placeholder="Role" value={role} onChange={e => setRole(e.target.value)} />
              <Input placeholder="Status (e.g. Interview)" value={status} onChange={e => setStatus(e.target.value)} />
              <Button onClick={addApplication}>Add Application</Button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {applications.map((a, i) => (
                <div key={i} className="border-b py-2 text-sm">
                  <strong>{a.company}</strong> — {a.role} <span className="text-gray-500">({a.status}, {a.date})</span>
                </div>
              ))}
            </div>
            <Button onClick={exportCSV} className="mt-4">Export to CSV</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
