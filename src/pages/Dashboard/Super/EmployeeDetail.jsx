import { useState, Fragment } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Dialog, Transition } from '@headlessui/react';
import {
  UserCircleIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, BriefcaseIcon, CalendarDaysIcon, AcademicCapIcon,
  LockClosedIcon, MagnifyingGlassPlusIcon, XMarkIcon, ArrowTrendingUpIcon, ClockIcon, CheckBadgeIcon
} from '@heroicons/react/24/outline';
import PageHeader from '../../../components/portal/PageHeader';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { Stagger, Item } from '../../../components/portal/motion';
import { getEmployeeByEmployeeId } from '../../../services/employeeService';
import { fmtDate, ageFrom, serviceYears, humanSpan, retirementState, BASIS_TEXT } from '../../../lib/retirement';

const Field = ({ label, value, wide }) => (
  <div className={wide ? 'sm:col-span-2' : ''}>
    <dt className="text-xs font-bold uppercase tracking-wide text-ink-400">{label}</dt>
    <dd className="mt-1 text-[0.95rem] font-semibold text-ink-900">{value || <span className="font-normal text-ink-300">Not recorded</span>}</dd>
  </div>
);

const Section = ({ icon: Icon, title, children, className = '' }) => (
  <Item as="section" className={`card p-6 ${className}`}>
    <h2 className="mb-5 flex items-center gap-2 text-base font-extrabold text-ink-900">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><Icon className="h-5 w-5" aria-hidden="true" /></span>
      {title}
    </h2>
    <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">{children}</dl>
  </Item>
);

// `qualifications` is stored as a JSON list of { name, date } — show it as a list, not raw JSON.
const Qualifications = ({ raw }) => {
  let list = null;
  try { const p = JSON.parse(raw); if (Array.isArray(p)) list = p; } catch { /* plain text */ }
  if (!raw) return <span className="font-normal text-ink-300">Not recorded</span>;
  if (!list) return raw;
  return (
    <ul className="space-y-1.5">
      {list.map((q, i) => (
        <li key={i} className="flex items-baseline justify-between gap-3 text-[0.92rem]">
          <span>{q.name}</span>
          {q.date && <span className="shrink-0 text-xs font-medium text-ink-400">{new Date(q.date).getUTCFullYear()}</span>}
        </li>
      ))}
    </ul>
  );
};

const titleCase = (s) => (s || '').trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

// Career history, oldest first, as a vertical timeline.
const CareerTimeline = ({ steps }) => {
  const list = (Array.isArray(steps) ? steps : []).filter(Boolean).slice().sort((a, b) => String(a.date).localeCompare(String(b.date)));
  if (!list.length) return <p className="text-sm text-ink-400">No career history has been recorded for this person.</p>;
  return (
    <ol className="relative ml-2 space-y-6 border-l-2 border-brand-100 pl-6">
      {list.map((s, i) => {
        const current = i === list.length - 1;
        return (
          <li key={`${s.date}-${i}`} className="relative">
            <span className={`absolute -left-[1.95rem] top-1 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white ${current ? 'bg-brand-600' : 'bg-brand-200'}`} />
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-xs font-bold uppercase tracking-wide text-ink-400">{fmtDate(s.date) || 'Date not recorded'}</span>
              {s.remark && <Badge variant={/promotion/i.test(s.remark) ? 'green' : 'gray'}>{s.remark}</Badge>}
              {current && <Badge variant="blue">Current</Badge>}
            </div>
            <p className="mt-1 font-bold text-ink-900">{titleCase(s.rank) || 'Rank not recorded'}</p>
            {s.grade_level && <p className="text-sm text-ink-500">Grade level {s.grade_level}</p>}
          </li>
        );
      })}
    </ol>
  );
};

const TONE_BAR = { green: 'from-brand-600 to-brand-800', yellow: 'from-gold-400 to-gold-500', red: 'from-red-500 to-red-700' };

const RetirementCard = ({ emp }) => {
  const state = retirementState(emp.retirement_date_calc, emp.retirement_leave_date);
  const service = serviceYears(emp.date_of_first_appointment);
  const age = ageFrom(emp.date_of_birth);
  return (
    <Item as="section" className="card overflow-hidden">
      <div className={`bg-gradient-to-r px-6 py-4 text-white ${TONE_BAR[state?.tone || 'green']}`}>
        <h2 className="flex items-center gap-2 text-base font-extrabold">
          <ClockIcon className="h-5 w-5" aria-hidden="true" /> Retirement
        </h2>
        {state ? (
          <p className="mt-1 text-sm font-semibold text-white/90"><span className="font-extrabold">{state.label}.</span> {state.detail}</p>
        ) : (
          <p className="mt-1 text-sm text-white/90">Can’t be worked out — no date of birth or first appointment on record.</p>
        )}
      </div>
      <dl className="grid gap-x-8 gap-y-5 p-6 sm:grid-cols-2">
        <Field label="Retirement date" value={fmtDate(emp.retirement_date_calc)} />
        <Field label="Retirement leave starts" value={fmtDate(emp.retirement_leave_date)} />
        <Field label="Why this date" value={BASIS_TEXT[emp.retirement_basis]} wide />
        <Field label="Age now" value={age != null ? `${age} years` : null} />
        <Field label="Time in service" value={service ? humanSpan(service) : null} />
      </dl>
      <p className="border-t border-ink-100 px-6 py-3 text-xs text-ink-400">
        Retirement is the earlier of 60 years of age or 35 years of service. Retirement leave starts 3 months before the retirement date.
      </p>
    </Item>
  );
};

// Click the photo to see it full size.
const PhotoLightbox = ({ src, name, open, onClose }) => (
  <Transition show={open} as={Fragment}>
    <Dialog onClose={onClose} className="relative z-[70]">
      <Transition.Child as={Fragment} enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0">
        <div className="fixed inset-0 bg-ink-950/85 backdrop-blur-sm" aria-hidden="true" />
      </Transition.Child>
      <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-8" onClick={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-250" enterFrom="opacity-0 scale-90" enterTo="opacity-100 scale-100" leave="ease-in duration-150" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
          <Dialog.Panel className="relative">
            <Dialog.Title className="sr-only">Photo of {name}</Dialog.Title>
            <img src={src} alt={`Photo of ${name}`} className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl ring-1 ring-white/20" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photo"
              className="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-800 shadow-lg transition-transform hover:scale-105"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <p className="mt-3 text-center text-sm font-semibold text-white/80">{name}</p>
          </Dialog.Panel>
        </Transition.Child>
      </div>
    </Dialog>
  </Transition>
);

const EmployeeDetail = () => {
  const { employeeId } = useParams();
  const [photoBroken, setPhotoBroken] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const { data: emp, isLoading, isError, error } = useQuery({
    queryKey: ['employees', 'detail', employeeId],
    queryFn: () => getEmployeeByEmployeeId(employeeId),
    retry: (count, err) => err?.response?.status !== 404 && count < 1
  });
  const notFound = isError && error?.response?.status === 404;
  const hasPhoto = emp?.photo_url && !photoBroken;
  const age = emp ? ageFrom(emp.date_of_birth) : null;
  const service = emp ? serviceYears(emp.date_of_first_appointment) : null;

  return (
    <div>
      <PageHeader backTo="/dashboard/employees" backLabel="All staff" icon={UserCircleIcon} title="Staff Record" description="This record can’t be changed here — it’s maintained in the staff enrollment system." />

      {isLoading ? (
        <div className="space-y-5"><Skeleton className="h-44 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" /></div>
      ) : notFound || (!emp && !isError) ? (
        <div className="card p-6"><EmptyState title="We couldn’t find that person" description="That file number doesn’t exist, or you don’t have access to it." action={<Link to="/dashboard/employees" className="btn btn-primary btn-md">Back to all staff</Link>} /></div>
      ) : isError ? (
        <div className="card p-6"><EmptyState title="We couldn’t load this record" description="Please check your connection and try again." /></div>
      ) : (
        <Stagger className="space-y-5" stagger={0.08}>
          <Item className="card relative overflow-hidden p-6 sm:p-8">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-brand-700 to-brand-900" aria-hidden="true" />
            <div className="bg-dots absolute inset-x-0 top-0 h-24 opacity-50" aria-hidden="true" />
            <div className="relative flex flex-col items-center gap-5 pt-8 text-center sm:flex-row sm:items-end sm:pt-10 sm:text-left">
              {hasPhoto ? (
                <button
                  type="button"
                  onClick={() => setPhotoOpen(true)}
                  aria-label={`View a larger photo of ${emp.full_name}`}
                  className="group relative h-32 w-32 shrink-0 cursor-zoom-in overflow-hidden rounded-3xl shadow-xl ring-4 ring-white focus:outline-none focus-visible:ring-brand-500"
                >
                  <img src={emp.photo_url} alt={`Photo of ${emp.full_name}`} onError={() => setPhotoBroken(true)} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <span className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-ink-900/60 via-transparent to-transparent pb-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <span className="flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[0.7rem] font-bold text-ink-800"><MagnifyingGlassPlusIcon className="h-3.5 w-3.5" aria-hidden="true" /> Enlarge</span>
                  </span>
                </button>
              ) : (
                <span className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-ink-50 text-ink-300 shadow-xl ring-4 ring-white"><UserCircleIcon className="h-20 w-20" aria-hidden="true" /></span>
              )}
              <div className="min-w-0 flex-1 pb-1">
                <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-[1.7rem]">{emp.full_name?.trim()}</h2>
                <p className="mt-0.5 font-mono text-sm text-ink-500">{emp.employee_id}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {emp.is_verified ? <Badge variant="green">Verified</Badge> : <Badge variant="yellow">Not yet verified</Badge>}
                  {emp.employment_status && <Badge variant={emp.employment_status === 'active' ? 'blue' : 'gray'} className="capitalize">{emp.employment_status}</Badge>}
                  {emp.grade_level && <Badge variant="gray">Grade level {emp.grade_level}</Badge>}
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-400"><LockClosedIcon className="h-4 w-4" aria-hidden="true" /> View only</p>
            </div>
          </Item>

          <RetirementCard emp={emp} />

          <div className="grid gap-5 lg:grid-cols-2">
            <Section icon={BriefcaseIcon} title="Work">
              <Field label="Rank" value={titleCase(emp.rank)} />
              <Field label="Grade level" value={emp.grade_level} />
              <Field label="Cadre" value={emp.cadre} wide />
              {emp.designation && <Field label="Designation" value={emp.designation} wide />}
              <Field label="Department" value={emp.department} wide />
              <Field label="Posted to" value={emp.present_station} wide />
            </Section>

            <Section icon={UserCircleIcon} title="Personal">
              <Field label="Sex" value={emp.sex} />
              <Field label="Date of birth" value={fmtDate(emp.date_of_birth)} />
              <Field label="Age" value={age != null ? `${age} years` : null} />
              <Field label="State of origin" value={emp.state_of_origin} />
              <Field label="Local government of origin" value={emp.lga_of_origin} wide />
            </Section>

            <Section icon={CalendarDaysIcon} title="Service dates">
              <Field label="First appointment" value={fmtDate(emp.date_of_first_appointment)} />
              <Field label="Time in service" value={service ? humanSpan(service) : null} />
              <Field label="Confirmation" value={fmtDate(emp.date_of_confirmation)} />
              <Field label="Present appointment" value={fmtDate(emp.date_of_present_appointment)} />
              <Field label="Conversion" value={fmtDate(emp.date_of_conversion || emp.date_of_transfer)} />
            </Section>

            <Section icon={MapPinIcon} title="Contact">
              <Field label="Phone" value={emp.phone_number && <span className="inline-flex items-center gap-1.5"><PhoneIcon className="h-4 w-4 text-ink-400" aria-hidden="true" />{emp.phone_number}</span>} />
              <Field label="Email" value={emp.email && <span className="inline-flex items-center gap-1.5 break-all"><EnvelopeIcon className="h-4 w-4 text-ink-400" aria-hidden="true" />{emp.email}</span>} />
            </Section>
          </div>

          <Item as="section" className="card p-6">
            <h2 className="mb-5 flex items-center gap-2 text-base font-extrabold text-ink-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" /></span>
              Career progression
            </h2>
            <CareerTimeline steps={emp.career_progression} />
          </Item>

          <Section icon={AcademicCapIcon} title="Qualifications &amp; remarks">
            <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wide text-ink-400">Qualifications</dt><dd className="mt-2 font-semibold text-ink-900"><Qualifications raw={emp.qualifications} /></dd></div>
            {emp.remark && <Field label="Remark" value={emp.remark} wide />}
          </Section>

          <Section icon={CheckBadgeIcon} title="Enrollment record">
            <Field label="Verification" value={emp.is_verified ? 'Verified' : 'Not yet verified'} />
            <Field label="Verified on" value={fmtDate(emp.verified_at)} />
            <Field label="Enrolled on" value={fmtDate(emp.created_at)} />
            <Field label="Last updated" value={fmtDate(emp.updated_at)} />
          </Section>

          {hasPhoto && <PhotoLightbox src={emp.photo_url} name={emp.full_name?.trim()} open={photoOpen} onClose={() => setPhotoOpen(false)} />}
        </Stagger>
      )}
    </div>
  );
};

export default EmployeeDetail;
