import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import PageHero from '../../components/common/PageHero';

const Contact = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    // TODO: Replace with actual API call
    setTimeout(() => {
      console.log('Contact form data:', data);
      setSubmitStatus('success');
      setIsSubmitting(false);
      reset();
    }, 1500);
  };

  const contactInfo = [
    {
      icon: MapPinIcon,
      title: 'Office Address',
      content: 'Local Government Service Commission Complex, Abakaliki, Ebonyi State, Nigeria'
    },
    {
      icon: PhoneIcon,
      title: 'Phone',
      content: '+234 (0) 803 555 0100'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email',
      content: 'ebonyistatelgsc@gmail.com'
    },
    {
      icon: ClockIcon,
      title: 'Office Hours',
      content: 'Monday - Friday: 8:00 AM - 5:00 PM'
    }
  ];

  return (
    <div className="bg-gov-gray-50/30 min-h-screen pb-20">
      {/* Institutional Masthead */}
      <header className="bg-gov-navy-900 text-white pt-20 pb-16 border-b-4 border-gov-green-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/logo/logo.png')] bg-no-repeat bg-right-top opacity-5 grayscale pointer-events-none translate-x-1/4 -translate-y-1/4 scale-150" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-green-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Official Enquiries
            </span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contact the Commission</h1>
            <p className="text-xl text-white/80 leading-relaxed max-w-2xl">
              Official administrative access for citizens, local government staff, and institutional partners.
            </p>
          </div>
        </div>
      </header>

      {/* Contact Grid */}
      <section className="container-custom py-16" id="contact-form">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-16 items-start">
          
          {/* Contact Details Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-8">
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-gov-navy-900 border-b border-gov-gray-200 pb-2">
                Administrative Access
              </h2>
              <p className="text-xs text-gov-gray-600 leading-relaxed">
                Reach out through our official channels for administrative enquiries, verification requests, or institutional support.
              </p>
            </div>

            <div className="grid gap-4">
              {contactInfo.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-white border border-gov-gray-200 p-6 shadow-sm transition-all hover:border-gov-navy-300">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gov-navy-50">
                        <Icon className="h-5 w-5 text-gov-navy-900" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xs font-bold text-gov-navy-900 uppercase tracking-widest">{item.title}</h3>
                        <p className="text-sm leading-relaxed text-gov-gray-700">{item.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-6 bg-gov-navy-900 text-white space-y-4 relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('/images/logo/logo.png')] bg-no-repeat bg-right-bottom opacity-10 grayscale scale-110" />
               <div className="relative z-10 space-y-3">
                 <h4 className="text-[10px] font-bold text-gov-green-500 uppercase tracking-widest">Public Accountability</h4>
                 <p className="text-xs text-white/70 leading-relaxed">
                   For formal petitions or misconduct reports, please use our dedicated accountability channel.
                 </p>
                 <Button as="a" href="/complaints" variant="outline" size="sm" className="w-full text-white border-white/20 hover:bg-white/10 rounded-none">
                   Submit Formal Petition
                 </Button>
               </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-gov-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gov-gray-50 border-b border-gov-gray-200 p-8 lg:p-10">
              <h2 className="text-2xl font-bold text-gov-navy-900 uppercase tracking-tight">Digital Enquiry Desk</h2>
              <p className="mt-2 text-gov-gray-600 max-w-2xl leading-relaxed text-sm">
                Enquiries are routed to the relevant directorates. Please provide clear details to facilitate a prompt administrative response.
              </p>
            </div>

            <div className="p-8 lg:p-12">
              {submitStatus === 'success' && (
                <div className="mb-10 p-6 bg-gov-green-50 border border-gov-green-200 text-gov-green-800">
                  <h4 className="font-bold mb-1">Enquiry Successfully Logged</h4>
                  <p className="text-sm opacity-90">Thank you for reaching out. Your message has been received by the central administrative desk.</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-gov-navy-900 uppercase tracking-widest border-b border-gov-gray-100 pb-2">Your Information</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <Input
                      label="Full Name"
                      required
                      {...register('name', { required: 'Name is required' })}
                      error={errors.name?.message}
                      placeholder="e.g. John Doe"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      required
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      error={errors.email?.message}
                      placeholder="e.g. citizen@example.com"
                    />
                  </div>
                  <Input
                    label="Phone Number (Optional)"
                    type="tel"
                    {...register('phone')}
                    placeholder="e.g. +234..."
                  />
                </div>

                <div className="space-y-6">
                  <h3 className="text-xs font-bold text-gov-navy-900 uppercase tracking-widest border-b border-gov-gray-100 pb-2">Message Particulars</h3>
                  <Input
                    label="Subject of Enquiry"
                    required
                    {...register('subject', { required: 'Subject is required' })}
                    error={errors.subject?.message}
                    placeholder="e.g. Service Verification Enquiry"
                  />
                  <Textarea
                    label="Detailed Message"
                    required
                    {...register('message', {
                      required: 'Message is required',
                      minLength: {
                        value: 10,
                        message: 'Message must be at least 10 characters'
                      }
                    })}
                    error={errors.message?.message}
                    placeholder="Please provide specific details regarding your enquiry..."
                    rows={8}
                  />
                </div>

                <div className="pt-6 border-t border-gov-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                   <p className="text-[10px] text-gov-gray-400 font-bold uppercase tracking-widest">
                     Response Window: 2–3 Working Days
                   </p>
                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full md:w-auto rounded-none px-12"
                  >
                    {isSubmitting ? 'Transmitting...' : 'Send Enquiry'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Physical Location */}
      <section className="container-custom py-16">
        <div className="bg-white border border-gov-gray-200 overflow-hidden">
          <div className="grid lg:grid-cols-2">
             <div className="p-8 lg:p-16 space-y-6 bg-gov-navy-900 text-white relative">
                <div className="absolute inset-0 bg-[url('/images/hero/hero1.jpg')] bg-cover bg-center opacity-10 grayscale mix-blend-overlay" />
                <div className="relative z-10 space-y-6">
                  <h2 className="text-3xl font-bold">Physical Registry</h2>
                  <p className="text-white/70 leading-relaxed text-lg">
                    The Commission headquarters maintains an official registry for physical submission of documents, circulars, and administrative records.
                  </p>
                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex gap-4">
                      <MapPinIcon className="w-6 h-6 text-gov-green-500 shrink-0" />
                      <div>
                        <h4 className="font-bold text-sm">Headquarters</h4>
                        <p className="text-xs text-white/60 mt-1 leading-relaxed">
                          Local Government Service Commission Complex,<br />
                          Onwe Road, Abakaliki, Ebonyi State.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
             <div className="h-96 lg:h-auto bg-gov-gray-100 flex items-center justify-center grayscale relative">
                <div className="absolute inset-0 bg-[url('/images/logo/logo.png')] bg-no-repeat bg-center opacity-10 grayscale scale-50" />
                <div className="text-center space-y-2 relative z-10">
                   <p className="text-xs font-bold text-gov-navy-900 uppercase tracking-widest">Map Integration Portfolio</p>
                   <p className="text-[10px] text-gov-gray-500">Official Commission Complex, Abakaliki</p>
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
