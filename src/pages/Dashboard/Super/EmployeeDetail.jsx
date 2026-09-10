import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Card from '../../../components/ui/Card';
import Skeleton from '../../../components/ui/Skeleton';
import EmptyState from '../../../components/ui/EmptyState';
import { getEmployeeByEmployeeId } from '../../../services/employeeService';

const Field = ({ label, value }) => (
  <div>
    <div className="text-xs font-medium text-gov-gray-500 uppercase tracking-wide">{label}</div>
    <div className="text-sm text-gov-gray-900 mt-0.5">{value || '—'}</div>
  </div>
);

const EmployeeDetail = () => {
  const { employeeId } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);
    getEmployeeByEmployeeId(employeeId)
      .then((data) => {
        if (cancelled) return;
        if (!data) setNotFound(true);
        else setEmployee(data);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err?.response?.status === 404) setNotFound(true);
        else {
          console.error('Failed to load employee', err);
          toast.error('Failed to load employee record');
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [employeeId]);

  return (
    <div className="space-y-6">
      <header>
        <Link to="/dashboard/employees" className="text-sm text-gov-blue-600 hover:text-gov-blue-700">
          &larr; Back to Employees
        </Link>
        <h1 className="heading-md mt-2">Employee Record</h1>
        <p className="text-gov-gray-600 mt-1">Read-only view — maintained by the Smart Onboarding system.</p>
      </header>

      {loading ? (
        <Card className="p-6"><Skeleton rows={10} /></Card>
      ) : notFound ? (
        <Card className="p-6">
          <EmptyState title="Employee not found" description={`No record exists for file number "${employeeId}".`} />
        </Card>
      ) : employee ? (
        <Card className="p-6">
          <div className="flex items-start gap-6 mb-6">
            {employee.photo_url ? (
              <img
                src={employee.photo_url}
                alt={employee.full_name}
                className="w-24 h-24 rounded-lg object-cover border border-gov-gray-200"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gov-gray-100 flex items-center justify-center text-gov-gray-400 text-xs">
                No photo
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-gov-gray-900">{employee.full_name}</h2>
              <p className="text-sm text-gov-gray-600">{employee.employee_id}</p>
              <span className={
                employee.is_verified
                  ? 'inline-block mt-2 px-2 py-0.5 text-xs rounded bg-green-100 text-green-700'
                  : 'inline-block mt-2 px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700'
              }>
                {employee.is_verified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Field label="Sex" value={employee.sex} />
            <Field label="Date of Birth" value={employee.date_of_birth?.slice(0, 10)} />
            <Field label="LGA of Origin" value={employee.lga_of_origin} />
            <Field label="Phone Number" value={employee.phone_number} />
            <Field label="Email" value={employee.email} />
            <Field label="Department" value={employee.department} />
            <Field label="Rank" value={employee.rank} />
            <Field label="Grade Level" value={employee.grade_level} />
            <Field label="Present Station" value={employee.present_station} />
            <Field label="Date of First Appointment" value={employee.date_of_first_appointment?.slice(0, 10)} />
            <Field label="Date of Confirmation" value={employee.date_of_confirmation?.slice(0, 10)} />
            <Field label="Date of Transfer" value={employee.date_of_transfer?.slice(0, 10)} />
            <Field label="Employment Status" value={employee.employment_status} />
            <Field label="Retirement Date" value={employee.retirement_date?.slice(0, 10)} />
            <Field label="Pension Number" value={employee.pension_number} />
            <Field label="Qualifications" value={employee.qualifications} />
            <Field label="Remark" value={employee.remark} />
            <Field label="Verified At" value={employee.verified_at?.slice(0, 10)} />
          </div>
        </Card>
      ) : null}
    </div>
  );
};

export default EmployeeDetail;
