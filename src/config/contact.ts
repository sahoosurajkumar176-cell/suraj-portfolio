export interface ServiceOption {
  id: string;
  number: string;
  name: string;
  minFare: number;
  maxFare: number;
}

export const CONTACT_CONFIG = {
  name: 'Suraj',
  phone: '8260970300',
  displayPhone: '+91 8260970300',
  email: 'sahoosurajkumar176@gmail.com',
  title: '3D Creator & Developer',
};

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'web-dev',
    number: '01',
    name: 'Website Development',
    minFare: 3499,
    maxFare: 7999,
  },
  {
    id: 'ai-automation',
    number: '02',
    name: 'AI & Business Automation',
    minFare: 3499,
    maxFare: 6999,
  },
  {
    id: 'motion-animation',
    number: '03',
    name: 'Motion & Web Animation',
    minFare: 2999,
    maxFare: 5999,
  },
  {
    id: 'ui-ux-brand',
    number: '04',
    name: 'UI/UX & Brand Design',
    minFare: 2499,
    maxFare: 4999,
  },
  {
    id: 'web-maintenance',
    number: '05',
    name: 'Website Maintenance',
    minFare: 1999,
    maxFare: 3999,
  },
];

export const BUDGET_OPTIONS = [
  '₹3,000 – ₹5,000',
  '₹5,000 – ₹8,000',
  '₹8,000 – ₹12,000',
  '₹12,000+',
];

export const MEETING_TYPES = [
  'Google Meet',
  'Phone Call',
  'WhatsApp Call',
];

export const TIME_SLOTS = [
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  '11:00 PM',
  '12:00 AM',
  '1:00 AM',
  '2:00 AM',
];

export interface EnquirySubmission {
  name: string;
  email: string;
  phone: string;
  businessName: string;
  websiteOrInstagram?: string;
  services: string[];
  projectDetails: string;
  budget: string;
  wantsMeeting: boolean;
  meetingType?: string;
  meetingDate?: string;
  meetingTime?: string;
  estimatedRange?: {
    min: number;
    max: number;
  };
  submittedAt: string;
}
