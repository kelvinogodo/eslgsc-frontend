import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import api from '../../services/api';
import useAuth from '../../context/useAuth';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';

const roleRedirectMap = {
  SUPER_ADMIN: '/dashboard',
  ADMIN: '/dashboard',
  MEDIA_ADMIN: '/dashboard/news-editor',
  AUDIT: '/dashboard/pending-edits'
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState(null);
  // Only offer the offline mock-login shortcuts when no real API base URL is
  // configured — with a real backend connected these mock tokens (fake
  // "mock-signature", not a real JWT) fail every subsequent request with
  // 401 once used, which is confusing to hit by accident during real testing.
  const isDev = import.meta.env.DEV && !import.meta.env.VITE_API_BASE_URL;

  const mockUsers = useMemo(() => ([
    {
      role: 'SUPER_ADMIN',
      label: 'Super Admin',
      id: 'super-1',
      name: 'Super Admin'
    },
    {
      role: 'ADMIN',
      label: 'Commission Admin',
      id: 'admin-1',
      name: 'Admin Officer'
    },
    {
      role: 'MEDIA_ADMIN',
      label: 'Media Editor',
      id: 'media-1',
      name: 'Media Editor'
    },
    {
      role: 'AUDIT',
      label: 'Audit Reviewer',
      id: 'audit-1',
      name: 'Audit Reviewer'
    }
  ]), []);

  const base64UrlEncode = (obj) =>
    btoa(JSON.stringify(obj))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

  const createMockToken = (user) => {
    const header = { alg: 'HS256', typ: 'JWT' };
    const payload = {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 30
    };
    return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.mock-signature`;
  };

  const handleMockLogin = (user) => {
    const token = createMockToken(user);
    login(user, token);
    toast.info(`Logged in as ${user.name}`);
    const roleDestination = roleRedirectMap[user.role];
    navigate(roleDestination || '/dashboard', { replace: true });
  };

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const response = await api.post('/auth/login', {
        email: values.email.trim().toLowerCase(),
        password: values.password
      });

    login(response.data.user, response.data.token);
    toast.success('Login successful');

    const roleDestination = roleRedirectMap[response.data.user.role];
    navigate(roleDestination || '/dashboard', { replace: true });
  } catch (error) {
    console.error(error);
      const message = error.response?.data?.message || 'Unable to sign in. Please check your credentials.';
      setAuthError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gov-gray-50 flex items-center justify-center py-16 px-4">
      <Card className="w-full max-w-xl p-8 md:p-10">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img
              src="/images/logo/logo.png"
              alt="ESLGSC"
              className="h-14 w-14"
            />
          </div>
          <h1 className="heading-md mb-2">Sign in to ESLGSC</h1>
          <p className="text-sm text-gov-gray-600">
            Enter your credentials to access dashboards and manage services across local governments.
          </p>
        </div>

        {authError && (
          <Alert variant="error" className="mb-6">
            {authError}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            required
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required'
            })}
          />

          <div>
            <label className="block text-sm font-medium text-gov-gray-700 mb-1" htmlFor="password">
              Password<span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className={`input pr-12 ${errors.password ? 'border-red-500 focus:ring-red-200' : ''}`}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password is required'
                })}
              />
              <button
                type="button"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gov-gray-500 hover:text-gov-blue-600"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-gov-gray-600">
              <input type="checkbox" className="rounded border-gov-gray-300" {...register('rememberMe')} />
              Keep me signed in
            </label>
            <Link to="/contact" className="text-gov-blue-600 hover:text-gov-blue-700">
              Need help?
            </Link>
          </div>

          <Button type="submit" disabled={isSubmitting} size="lg" className="w-full">
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {isDev && (
          <div className="mt-8 border-t border-gov-gray-200 pt-6">
            <p className="text-xs uppercase tracking-wide text-gov-gray-500 mb-3">
              Developer shortcuts (offline)
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {mockUsers.map((user) => (
                <Button
                  key={user.role}
                  type="button"
                  variant="secondary"
                  onClick={() => handleMockLogin(user)}
                >
                  Enter as {user.label}
                </Button>
              ))}
            </div>
            <p className="text-xs text-gov-gray-500 mt-3">
              Use these while the API is offline. Switch roles by selecting a different shortcut.
            </p>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gov-gray-600">
          <span>Public user? </span>
          <Link to="/contact" className="text-gov-blue-600 hover:text-gov-blue-700 font-medium">
            Reach our support desk
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;
