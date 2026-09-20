import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { UserCircleIcon, PhoneIcon, EnvelopeIcon, MapPinIcon, BriefcaseIcon, CalendarDaysIcon, AcademicCapIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../../components/portal/PageHeader';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import { Stagger, Item } from '../../../components/portal/motion';
import { getEmployeeByEmployeeId } from '../../../services/employeeService';

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : null);

const Field = ({ label, value, wide }) => (
  <div className={wide ? 'sm:col-span-2' : ''}>
    <dt className="text-xs font-bold uppercase tracking-wide text-ink-400">{label}</dt>
    <dd className="mt-1 text-[0.95rem] font-semibold text-ink-900">{value || <span className="font-normal text-ink-300">Not recorded</span>}</dd>
  </div>
);

const Section = ({ icon: Icon, title, children }) => (
  <Item as="section" className="card p-6">
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
          {q.date && <span className="shrink-0 text-xs font-medium text-ink-400">{new Date(q.date).getFullYear()}</span>}
        </li>
      ))}
    </ul>
  );
};

const EmployeeDetail = () => {
  const { employeeId } = useParams();
  const [photoBroken, setPhotoBroken] = useState(false);
  const { data: emp, isLoading, isError, error } = useQuery({
    queryKey: ['employees', 'detail', employeeId],
    queryFn: () => getEmployeeByEmployeeId(employeeId),
    retry: (count, err) => err?.response?.status !== 404 && count < 1
  });
  const notFound = isError && error?.response?.status === 404;

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
              {emp.photo_url && !photoBroken ? (
                <img src={emp.photo_url} alt={`Photo of ${emp.full_name}`} onError={() => setPhotoBroken(true)} className="h-32 w-32 shrink-0 rounded-3xl object-cover shadow-xl ring-4 ring-white" />
              ) : (
                <span className="flex h-32 w-32 shrink-0 items-center justify-center rounded-3xl bg-ink-50 text-ink-300 shadow-xl ring-4 ring-white"><UserCircleIcon className="h-20 w-20" aria-hidden="true" /></span>
              )}
              <div className="min-w-0 flex-1 pb-1">
                <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 sm:text-[1.7rem]">{emp.full_name?.trim()}</h2>
                <p className="mt-0.5 font-mono text-sm text-ink-500">{emp.employee_id}</p>
                <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
                  {emp.is_verified ? <Badge variant="green">Verified</Badge> : <Badge variant="yellow">Not yet verified</Badge>}
                  {emp.employment_status && <Badge variant={emp.employment_status === 'active' ? 'blue' : 'gray'} className="capitalize">{emp.employment_status}</Badge>}
                  {emp.grade_level && <Badge variant="gray">{emp.grade_level}</Badge>}
                </div>
              </div>
              <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-400"><LockClosedIcon className="h-4 w-4" aria-hidden="true" /> View only</p>
            </div>
          </Item>

          <div className="grid gap-5 lg:grid-cols-2">
            <Section icon={BriefcaseIcon} title="Work">
              <Field label="Rank" value={emp.rank} />
              <Field label="Grade level" value={emp.grade_level} />
              <Field label="Department" value={emp.department} wide />
              <Field label="Posted to" value={emp.present_station} wide />
            </Section>

            <Section icon={UserCircleIcon} title="Personal">
              <Field label="Sex" value={emp.sex} />
              <Field label="Date of birth" value={fmtDate(emp.date_of_birth)} />
              <Field label="Local government of origin" value={emp.lga_of_origin} wide />
            </Section>

            <Section icon={CalendarDaysIcon} title="Key dates">
              <Field label="First appointment" value={fmtDate(emp.date_of_first_appointment)} />
              <Field label="Confirmation" value={fmtDate(emp.date_of_confirmation)} />
              <Field label="Last transfer" value={fmtDate(emp.date_of_transfer)} />
              <Field label="Verified on" value={fmtDate(emp.verified_at)} />
              <Field label="Retirement date" value={fmtDate(emp.retirement_date)} />
              <Field label="Pension number" value={emp.pension_number} />
            </Section>

            <Section icon={MapPinIcon} title="Contact">
              <Field label="Phone" value={emp.phone_number && <span className="inline-flex items-center gap-1.5"><PhoneIcon className="h-4 w-4 text-ink-400" aria-hidden="true" />{emp.phone_number}</span>} />
              <Field label="Email" value={emp.email && <span className="inline-flex items-center gap-1.5 break-all"><EnvelopeIcon className="h-4 w-4 text-ink-400" aria-hidden="true" />{emp.email}</span>} />
            </Section>
          </div>

          <Section icon={AcademicCapIcon} title="Qualifications &amp; remarks">
            <div className="sm:col-span-2"><dt className="text-xs font-bold uppercase tracking-wide text-ink-400">Qualifications</dt><dd className="mt-2 font-semibold text-ink-900"><Qualifications raw={emp.qualifications} /></dd></div>
            {emp.remark && <Field label="Remark" value={emp.remark} wide />}
          </Section>
        </Stagger>
      )}
    </div>
  );
};

export default EmployeeDetail;
