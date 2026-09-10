import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

import { submitPublicComplaint } from '../../services/complaintService';

const complaintTypes = [
  { value: 'service-delivery', label: 'Service Delivery Concern' },
  { value: 'administrative-conduct', label: 'Administrative Conduct Report' },
  { value: 'financial-misconduct', label: 'Financial Impropriety / Misconduct Report' },
  { value: 'public-petition', label: 'Public Petition' },
  { value: 'general-enquiry', label: 'General Enquiry' }
];

const preferredChannels = [
  { value: 'email', label: 'Email Response' },
  { value: 'phone', label: 'Phone Call' },
  { value: 'physical-meeting', label: 'Physical Meeting' }
];

const Complaint = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [submissionId, setSubmissionId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setStatus(null);
    setErrorMessage('');
    setSubmissionId(null);

    try {
      const result = await submitPublicComplaint({
        fullName: data.name || 'Anonymous',
        email: data.email,
        phone: data.phone,
        subject: data.issueType, // Or map to a specific subject field if added
        category: data.issueType,
        localGovernment: data.location,
        message: data.details,
        suggestedAction: data.notes,
      });
      
      setStatus('success');
      setSubmissionId(result.id);
      reset();
    } catch (error) {
      console.error('Submission error:', error);
      setStatus('error');
      setErrorMessage(error.response?.data?.message || 'Submission could not be sent. Please try again later or contact the Commission directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-24 bg-gov-gray-50/30">
      {/* Institutional Masthead */}
      <header className="bg-gov-navy-900 text-white pt-20 pb-16 border-b-4 border-gov-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/logo/logo.png')] bg-no-repeat bg-right-top opacity-5 grayscale pointer-events-none translate-x-1/4 -translate-y-1/4 scale-150" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Public Accountability Channel
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Complaints & Public Petitions</h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              The official administrative channel for submitting formal complaints, petitions, and service-related concerns directly to the Commission.
            </p>
          </div>
        </div>
      </header>

      {/* Guidance Section */}
      <section className="bg-white border-b border-gov-gray-200 py-12 lg:py-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20 items-start">
            <div className="space-y-6 lg:sticky lg:top-8">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gov-navy-900 border-b border-gov-gray-200 pb-2">
                Submission Guidance
              </h2>
              <p className="text-sm text-gov-gray-600 leading-relaxed">
                To ensure your concern is processed efficiently, please review these requirements before submitting your petition.
              </p>
              <div className="p-5 bg-gov-navy-50 border-l-4 border-gov-navy-600 space-y-3">
                <h4 className="text-xs font-bold text-gov-navy-900 uppercase tracking-wider">Urgent Security Matters</h4>
                <p className="text-xs text-gov-gray-600 leading-relaxed">
                  For immediate security threats or criminal emergencies, please contact the appropriate state law enforcement or emergency services directly.
                </p>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-3">
                <h3 className="font-bold text-gov-navy-900">What to Submit</h3>
                <ul className="space-y-2 text-sm text-gov-gray-600 list-disc pl-4 leading-relaxed">
                  <li>Reports of administrative misconduct or staff impropriety.</li>
                  <li>Concerns regarding service delivery quality in LGAs.</li>
                  <li>Evidence-based reports of fraud, corruption, or extortion.</li>
                  <li>Formal petitions regarding Commission policy implementation.</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-bold text-gov-navy-900">What NOT to Submit</h3>
                <ul className="space-y-2 text-sm text-gov-gray-600 list-disc pl-4 leading-relaxed">
                  <li>Commercial solicitations or job applications.</li>
                  <li>Personal grievances unrelated to public service.</li>
                  <li>Abusive, defamatory, or false accusations.</li>
                  <li>Spam or automated marketing content.</li>
                </ul>
              </div>
              <div className="sm:col-span-2 p-6 border border-gov-gray-100 bg-gov-gray-50/50 space-y-4">
                <h3 className="font-bold text-gov-navy-900">Information Handling & Integrity</h3>
                <p className="text-sm text-gov-gray-600 leading-relaxed">
                  All submissions are received through the Commission's official administrative channel. To assist in a thorough review, please provide specific details including dates, locations, and involved parties. False or malicious submissions are a violation of administrative integrity and will not be processed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="container-custom pt-16">
        <div className="grid gap-8 md:grid-cols-4">
          {[
            { step: '01', title: 'Formal Submission', desc: 'The petition is logged through the official intake channel.' },
            { step: '02', title: 'Initial Review', desc: 'Compliance officers verify the submission and evidence.' },
            { step: '03', title: 'Internal Review', desc: 'Concerns are routed for internal administrative review.' },
            { step: '04', title: 'Official Response', desc: 'The Commission issues a formal response or follow-up.' }
          ].map((item) => (
            <div key={item.step} className="space-y-3">
              <span className="text-2xl font-black text-gov-navy-900/10 tracking-tighter">{item.step}</span>
              <h4 className="text-sm font-bold text-gov-navy-900 uppercase tracking-wide">{item.title}</h4>
              <p className="text-xs text-gov-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Complaint Form Section */}
      <section className="container-custom py-16" id="complaint-form">
        <div className="bg-white border border-gov-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gov-navy-50 border-b border-gov-gray-200 p-8 lg:p-10">
            <h2 className="text-2xl font-bold text-gov-navy-900 uppercase tracking-tight">Administrative Intake Form</h2>
            <p className="mt-2 text-gov-gray-600 max-w-2xl leading-relaxed">
              Please provide a detailed and factual account of your concern. All information provided will be handled through official Commission administrative protocols.
            </p>
          </div>

          <div className="p-8 lg:p-12">
            {status === 'success' && (
              <div className="mb-10 p-6 bg-gov-green-50 border border-gov-green-200 text-gov-green-800">
                <h4 className="font-bold mb-1 text-lg">Submission Successful</h4>
                <p className="text-sm opacity-90">Your submission has been received by the Commission’s public complaints channel.</p>
                {submissionId && (
                  <div className="mt-4 pt-4 border-t border-gov-green-200/50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gov-green-700">Reference ID</span>
                    <p className="text-xs font-mono mt-1 font-bold">{submissionId}</p>
                  </div>
                )}
              </div>
            )}

            {status === 'error' && (
              <div className="mb-10 p-6 bg-red-50 border border-red-200 text-red-800">
                <h4 className="font-bold mb-1">Submission Failed</h4>
                <p className="text-sm">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gov-navy-900 uppercase tracking-widest border-b border-gov-gray-100 pb-2">Subject Information</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <Select
                    label="Complaint Category"
                    required
                    options={complaintTypes}
                    error={errors.issueType?.message}
                    {...register('issueType', { required: 'Category is required' })}
                  />
                  <Input
                    label="Local Government Area or Specific Office"
                    placeholder="e.g. Afikpo North LGA / ICT Directorate"
                    error={errors.location?.message}
                    {...register('location', { maxLength: { value: 100, message: 'Location too long' } })}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gov-navy-900 uppercase tracking-widest border-b border-gov-gray-100 pb-2">Petitioner Details</h3>
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Full Name"
                    placeholder="Optional: leave blank for anonymous submission"
                    error={errors.name?.message}
                    {...register('name', { maxLength: { value: 100, message: 'Name too long' } })}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="e.g. +234..."
                    error={errors.phone?.message}
                    {...register('phone', { maxLength: { value: 30, message: 'Phone number too long' } })}
                  />
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="e.g. citizen@example.com"
                    error={errors.email?.message}
                    {...register('email', { 
                      maxLength: { value: 150, message: 'Email too long' },
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                    })}
                  />
                  <Select
                    label="Preferred Follow-up Channel"
                    options={preferredChannels}
                    {...register('channel')}
                  />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold text-gov-navy-900 uppercase tracking-widest border-b border-gov-gray-100 pb-2">Case Particulars</h3>
                <Textarea
                  label="Detailed Description of the Incident/Concern"
                  required
                  rows={8}
                  placeholder="Provide dates, names, specific events, and any available evidence or witnesses."
                  error={errors.details?.message}
                  {...register('details', { 
                    required: 'Detailed description is required',
                    minLength: { value: 10, message: 'Please provide more detail' },
                    maxLength: { value: 5000, message: 'Description too long (max 5000 chars)' }
                  })}
                />
                <Textarea
                  label="Suggested Administrative Action"
                  rows={4}
                  placeholder="Describe your desired resolution or any specific actions you believe should be taken."
                  error={errors.notes?.message}
                  {...register('notes', { maxLength: { value: 2000, message: 'Suggested action text too long' } })}
                />
              </div>

              <div className="pt-6 border-t border-gov-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3 text-gov-gray-500 max-w-lg">
                  <div className="w-1.5 h-1.5 rounded-full bg-gov-navy-200 shrink-0" />
                  <p className="text-xs leading-relaxed">
                    By submitting this form, you affirm that the information provided is truthful to the best of your knowledge. All submissions are processed through the official Commission registry.
                  </p>
                </div>
                <Button type="submit" size="lg" className="w-full md:w-auto rounded-none px-12" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging Submission...' : 'Submit Formal Petition'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Alternative Contact & Accountability */}
      <section className="bg-gov-navy-900 py-20 text-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <div className="inline-block border-l-4 border-gov-green-600 pl-4">
                <h2 className="text-2xl font-bold uppercase tracking-tight">Direct Administrative Access</h2>
                <p className="text-sm text-gov-green-500 font-bold uppercase tracking-[0.2em] mt-1">Public Complaints Desk</p>
              </div>
              <p className="text-lg text-white/70 leading-relaxed">
                For complex petitions or matters requiring physical submission of documents, citizens may visit the Complaints Desk at the Commission headquarters. All submissions are reviewed through the official administrative registry.
              </p>
              <div className="pt-6 border-t border-white/10 space-y-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] font-bold text-gov-gray-400 uppercase tracking-widest">Office Location</span>
                  <p className="text-sm font-medium">Local Government Service Commission Complex, Abakaliki, Ebonyi State.</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] font-bold text-gov-gray-400 uppercase tracking-widest">Official Registry Email</span>
                  <a href="mailto:ebonyistatelgsc@gmail.com" className="text-sm font-medium hover:text-gov-cyan-400 transition-colors">ebonyistatelgsc@gmail.com</a>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 p-8 lg:p-12 space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gov-green-500">Handling Protocol</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Information submitted through this portal is for internal administrative review. Petitions are routed for verification and appropriate administrative action.
              </p>
              <p className="text-sm text-white/60 leading-relaxed italic border-l border-white/20 pl-4 font-medium">
                "Transparency in local governance starts with public accountability and responsive administrative oversight."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Complaint;