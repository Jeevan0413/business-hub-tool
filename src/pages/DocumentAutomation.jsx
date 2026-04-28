import React, { useState } from 'react';
import { 
  Files, 
  Upload, 
  Download, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  X,
  FileDown
} from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import { jsPDF } from 'jspdf';

export default function DocumentAutomation() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, uploaded, processing, completed

  const downloadTemplate = () => {
    const headers = ['name', 'email', 'role', 'date'];
    const csvContent = [
      headers.join(','),
      'John Doe,john@ex.com,Developer,2025-05-01',
      'Jane Smith,jane@ex.com,Designer,2025-05-15'
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'document_automation_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFile(file);
    setStatus('uploaded');
    
    // Mock CSV parsing
    const reader = new FileReader();
    reader.onload = (event) => {
      // In a real app, we'd use a CSV parser like PapaParse
      // Here we'll simulate parsed data
      const mockData = [
        { name: 'Rahul Sharma', email: 'rahul@company.com', role: 'Software Engineer', date: '2025-05-01' },
        { name: 'Priya Patel', email: 'priya@company.com', role: 'Designer', date: '2025-05-05' },
        { name: 'Amit Singh', email: 'amit@company.com', role: 'Manager', date: '2025-05-10' },
      ];
      setData(mockData);
    };
    reader.readAsText(file);
  };

  const generateBulkPDFs = async () => {
    setIsProcessing(true);
    setStatus('processing');

    for (const item of data) {
      const doc = new jsPDF();
      doc.setFontSize(24);
      doc.text('OFFER LETTER', 105, 40, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 60);
      doc.text(`To: ${item.name}`, 20, 70);
      doc.text(`Email: ${item.email}`, 20, 77);
      
      doc.text(`Dear ${item.name.split(' ')[0]},`, 20, 90);
      doc.text(`We are pleased to offer you the position of ${item.role} at our company.`, 20, 100);
      doc.text(`Your joining date will be ${item.date}.`, 20, 110);
      
      doc.text('Best regards,', 20, 130);
      doc.text('Human Resources Team', 20, 137);
      
      // In a real app, we might zip these or offer a bulk download
      // For this demo, we'll just simulate a slight delay for each
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsProcessing(false);
    setStatus('completed');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
          <Files className="text-purple-500" size={32} />
          Document Automation
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">Upload a CSV to generate bulk certificates or offer letters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className={`p-12 border-2 border-dashed transition-all flex flex-col items-center text-center ${
            status === 'idle' ? 'border-slate-200 dark:border-white/10 hover:border-primary-500/50' : 'border-primary-500 bg-primary-500/5'
          }`}>
            <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 ${
              status === 'idle' ? 'bg-slate-100 dark:bg-white/5 text-slate-400' : 'bg-primary-600 text-white shadow-xl shadow-primary-500/30'
            }`}>
              <Upload size={40} />
            </div>
            {status === 'idle' ? (
              <>
                <h3 className="text-xl font-bold dark:text-white mb-2">Upload CSV File</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
                  Upload a CSV file containing employee names, roles, and dates to start bulk processing.
                </p>
                <input 
                  type="file" 
                  id="csv-upload" 
                  className="hidden" 
                  accept=".csv"
                  onChange={handleFileUpload}
                />
                <label htmlFor="csv-upload">
                  <Button className="cursor-pointer pointer-events-none">
                    Select File
                  </Button>
                </label>
              </>
            ) : (
              <div className="w-full max-w-md">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 mb-8">
                  <div className="flex items-center gap-3">
                    <FileText className="text-primary-600" />
                    <div className="text-left">
                      <div className="font-bold dark:text-white text-sm truncate max-w-[200px]">{file.name}</div>
                      <div className="text-xs text-slate-500">{(file.size / 1024).toFixed(2)} KB</div>
                    </div>
                  </div>
                  <button onClick={() => setStatus('idle')} className="text-slate-400 hover:text-red-500">
                    <X size={20} />
                  </button>
                </div>
                
                {status === 'uploaded' && (
                  <Button onClick={generateBulkPDFs} className="w-full py-4 text-lg">
                    Process {data.length} Records
                  </Button>
                )}

                {status === 'processing' && (
                  <div className="space-y-4">
                    <div className="h-2 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 animate-progress" style={{ width: '60%' }}></div>
                    </div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Generating PDFs... 2 of {data.length} completed</p>
                  </div>
                )}

                {status === 'completed' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-600 font-bold">
                      <CheckCircle2 /> Successfully processed {data.length} documents!
                    </div>
                    <Button variant="secondary" className="w-full py-4 text-lg">
                      <FileDown /> Download ZIP Archive
                    </Button>
                    <button onClick={() => setStatus('idle')} className="text-sm font-medium text-slate-500 hover:text-slate-700">
                      Start New Process
                    </button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {data.length > 0 && status !== 'idle' && (
            <Card>
              <h3 className="text-lg font-bold mb-6 dark:text-white">Data Preview</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-500 text-sm border-b dark:border-white/5">
                      <th className="pb-4">Name</th>
                      <th className="pb-4">Role</th>
                      <th className="pb-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-white/5">
                    {data.map((row, i) => (
                      <tr key={i}>
                        <td className="py-3 font-medium dark:text-white">{row.name}</td>
                        <td className="py-3 text-slate-500">{row.role}</td>
                        <td className="py-3 text-slate-500">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-bold mb-4 dark:text-white">CSV Template</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Your CSV file should follow this structure for best results:
            </p>
            <div className="bg-slate-50 dark:bg-black/20 p-4 rounded-xl font-mono text-xs dark:text-slate-300 leading-loose">
              name,email,role,date<br/>
              John Doe,john@ex.com,Dev,2025-01-01<br/>
              Jane Smith,jane@ex.com,Des,2025-01-10
            </div>
            <Button variant="secondary" className="w-full mt-6 text-sm" onClick={downloadTemplate}>
              <Download size={16} /> Download Template
            </Button>
          </Card>

          <Card className="bg-slate-900 text-white border-none">
            <div className="flex gap-4">
              <div className="p-3 bg-white/10 rounded-xl h-fit">
                <AlertCircle className="text-yellow-400" />
              </div>
              <div>
                <h4 className="font-bold mb-1">Privacy Note</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  All document generation happens locally in your browser. We never store or upload your sensitive employee data to our servers.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
