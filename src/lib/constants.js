/**
 * Application constants
 */

export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MEDIA_ADMIN: 'MEDIA_ADMIN',
  AUDIT: 'AUDIT',
  LGA: 'LGA'
};

export const NEWS_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  ARCHIVED: 'archived'
};

export const AUDIT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const SERVICE_CATEGORIES = [
  { value: 'seminars', label: 'Workshops & Training' },
  { value: 'grants', label: 'Grants & Community Funding' },
  { value: 'programs', label: 'Public Governance Programmes' },
  { value: 'advocacy', label: 'Advocacy & Public Outreach' },
  { value: 'policy', label: 'Policies & Circulars' },
  { value: 'documentation', label: 'Official Documents' }
];

export const DEPARTMENTS = [
  'Administration & General Services',
  'Finance & Accounts',
  'Institutional Development',
  'Information & Communication Technology',
  'Legal Services & Compliance',
  'Planning, Research & Statistics',
  'Public Relations & Media',
  'Internal Audit',
  'Local Government Oversight'
];

/**
 * Executive leadership profiles
 * Images are stored in public/images/staffs/
 * Order: Chairman first, HPMs next, then other executives
 */
export const EXECUTIVES = [
  {
    name: 'Chief Romanus Okemini Nwasum',
    role: 'Chairman Ebonyi State Local Government Service Commission (ESLGSC)',
    image: '/images/staffs/chief_romanus_okemini_nwasum.jpg'
  },
  {
    name: 'Mrs Nene I Chijioke-Alum',
    role: 'HPM III LGSC',
    image: '/images/staffs/mrs_nene_i_chijioke-alum.jpg'
  },
  {
    name: 'Mr Emma Ogbu Ituma',
    role: 'HPM IV LGSC',
    image: '/images/staffs/mr_emma_ogbu_ituma.jpg'
  },
  {
    name: 'Mr Alex E Iduma',
    role: 'HPM II LGSC',
    image: '/images/staffs/mr_alex_e_iduma.jpg'
  },
  {
    name: 'Mrs Nnachi Rachael Orie',
    role: 'HPM LGSC',
    image: '/images/staffs/mrs_nnachi_rachael_orie.jpg'
  },
  {
    name: 'Mrs Amaka Eucharia Larry-Udu',
    role: 'HPM Pension LGSC',
    image: '/images/staffs/mrs_amaka_eucharia_larry-udu.jpg'
  },
  {
    name: 'Mr Paulinus A Okafor',
    role: 'HPM (PRS) LGSC',
    image: '/images/staffs/mr_paulinus_a_okafor.jpg'
  },
  {
    name: 'Mrs Edith Eze',
    role: 'HPM ICT LGSC',
    image: '/images/staffs/mrs_edith_eze.jpg'
  },
  {
    name: 'Mr Egwu Ernest Otu',
    role: 'Cashier LGSC',
    image: '/images/staffs/mr_egwu_ernest_otu.jpg'
  },
  {
    name: 'Mrs Chinyere G Okorie',
    role: 'Director of Agriculture (HOD)',
    image: '/images/staffs/mrs_chinyere_g_okorie.jpg'
  },
  {
    name: 'Mr Alphonsus C Anyigor',
    role: 'Director of Admin and Gen. Service (Sir. of Training)',
    image: '/images/staffs/mr_alphonsus_c_anyigor.jpg'
  },
  {
    name: 'Mrs Stella Nwagu',
    role: 'Director of Education & Social Welfare (HOD)',
    image: '/images/staffs/mrs_stella_nwagu.jpg'
  },
  {
    name: 'Mrs Bridget N Jioke',
    role: 'Internal Auditor LGSC',
    image: '/images/staffs/mrs_bridget_n_jioke.jpg'
  },
  {
    name: 'Mrs Lydia Ebere Ugama',
    role: '',
    image: '/images/staffs/mrs_lydia_ebere_ugama.jpg'
  },
  {
    name: 'Arc Augustine Nwechara Nwofoke',
    role: 'Commissioner 1 Ebonyi State Local Government Service Commission',
    image: '/images/staffs/arc_augustine_nwechara_nwofoke.jpg'
  }
];

export const OFFICIAL_NOTICE_STRIP = null;

export const STATIC_NEWS_FALLBACK = [];

export const OFFICIAL_CIRCULARS = [];
