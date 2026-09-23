import useAuth from '../../context/useAuth';
import { greeting } from '../../lib/utils';

/** Greeting banner at the top of each role's home page. Buttons go in `children`. */
const DashboardHero = ({ message, children }) => {
  const { user } = useAuth();
  const first = user?.name?.split(' ')[0] || 'there';
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <section className="mb-8 rounded-3xl bg-brand-800 p-7 text-white sm:p-9">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <p className="mb-2 text-sm font-semibold text-gold-200">{today}</p>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight sm:text-[2.15rem]">
            {greeting()}, {first}
          </h1>
          {message && <p className="mt-2 text-[0.98rem] leading-relaxed text-brand-100/85">{message}</p>}
        </div>
        {children && <div className="flex flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
};

export default DashboardHero;
