import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true
}) => {
  const sizeClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }[size];

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog onClose={onClose} className="relative z-50">
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink-900/40 backdrop-blur-sm" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 sm:items-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-250"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel
                className={clsx(
                  'w-full rounded-3xl bg-white shadow-2xl shadow-ink-900/20 ring-1 ring-black/5',
                  sizeClass
                )}
              >
                {(title || showCloseButton) && (
                  <div className="flex items-center justify-between gap-4 border-b border-gov-gray-100 px-6 py-4">
                    {title ? (
                      <Dialog.Title className="text-lg font-extrabold text-gov-gray-900">
                        {title}
                      </Dialog.Title>
                    ) : <span />}
                    {showCloseButton && (
                      <button
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="rounded-xl p-2 text-gov-gray-400 transition-colors hover:bg-gov-gray-100 hover:text-gov-gray-700"
                      >
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                )}
                <div className="px-6 py-5">
                  {children}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
