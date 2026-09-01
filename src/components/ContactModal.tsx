import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Check,
  Video,
  Phone,
  MessageSquare,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Mail,
  User,
  Building,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useContactModal } from '../context/ContactModalContext';
import {
  CONTACT_CONFIG,
  SERVICE_OPTIONS,
  BUDGET_OPTIONS,
  MEETING_TYPES,
  TIME_SLOTS,
  type EnquirySubmission,
} from '../config/contact';

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  businessName?: string;
  services?: string;
  projectDetails?: string;
  budget?: string;
  meetingDate?: string;
  meetingTime?: string;
  meetingType?: string;
}

export default function ContactModal() {
  const { isOpen, closeContactModal, initialServiceId } = useContactModal();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [websiteOrInstagram, setWebsiteOrInstagram] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [projectDetails, setProjectDetails] = useState('');
  const [budget, setBudget] = useState(BUDGET_OPTIONS[1]);
  const [wantsMeeting, setWantsMeeting] = useState(false);
  const [meetingType, setMeetingType] = useState(MEETING_TYPES[0]);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState(TIME_SLOTS[0]);

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState<EnquirySubmission | null>(null);

  // Set initial service if specified
  useEffect(() => {
    if (isOpen) {
      if (initialServiceId && !selectedServices.includes(initialServiceId)) {
        setSelectedServices([initialServiceId]);
      } else if (selectedServices.length === 0) {
        setSelectedServices([SERVICE_OPTIONS[0].id]);
      }
      setIsSubmitted(false);
      setSubmitError(null);
      setErrors({});
    }
  }, [isOpen, initialServiceId]);

  // Minimum selectable date (today)
  const todayString = new Date().toISOString().split('T')[0];

  // Dynamic estimated range calculation based on selected services
  const selectedServiceObjects = SERVICE_OPTIONS.filter((s) =>
    selectedServices.includes(s.id)
  );

  const estimatedMin = selectedServiceObjects.reduce((acc, s) => acc + s.minFare, 0);
  const estimatedMax = selectedServiceObjects.reduce((acc, s) => acc + s.maxFare, 0);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!phone.trim()) {
      newErrors.phone = 'Phone / WhatsApp number is required';
    } else if (phone.trim().replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!businessName.trim()) {
      newErrors.businessName = 'Business or brand name is required';
    }

    if (selectedServices.length === 0) {
      newErrors.services = 'Please select at least one service';
    }

    if (!projectDetails.trim()) {
      newErrors.projectDetails = 'Please provide details about your project';
    }

    if (!budget) {
      newErrors.budget = 'Please select an approximate budget';
    }

    if (wantsMeeting) {
      if (!meetingDate) {
        newErrors.meetingDate = 'Please select a preferred date for the call';
      }
      if (!meetingTime) {
        newErrors.meetingTime = 'Please select a preferred time slot';
      }
      if (!meetingType) {
        newErrors.meetingType = 'Please select a meeting platform';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const submissionPayload: EnquirySubmission = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      businessName: businessName.trim(),
      websiteOrInstagram: websiteOrInstagram.trim() || undefined,
      services: selectedServiceObjects.map((s) => s.name),
      projectDetails: projectDetails.trim(),
      budget,
      wantsMeeting,
      meetingType: wantsMeeting ? meetingType : undefined,
      meetingDate: wantsMeeting ? meetingDate : undefined,
      meetingTime: wantsMeeting ? meetingTime : undefined,
      estimatedRange:
        selectedServiceObjects.length > 0
          ? { min: estimatedMin, max: estimatedMax }
          : undefined,
      submittedAt: new Date().toISOString(),
    };

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionPayload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to deliver enquiry email. Please try again.');
      }

      setSubmittedData(submissionPayload);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error('Submission error:', err);
      setSubmitError(
        err.message || 'Unable to deliver enquiry email right now. Please check your connection or send directly via WhatsApp.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setBusinessName('');
    setWebsiteOrInstagram('');
    setSelectedServices([SERVICE_OPTIONS[0].id]);
    setProjectDetails('');
    setBudget(BUDGET_OPTIONS[1]);
    setWantsMeeting(false);
    setMeetingType(MEETING_TYPES[0]);
    setMeetingDate('');
    setMeetingTime(TIME_SLOTS[0]);
    setIsSubmitted(false);
    setSubmittedData(null);
    setSubmitError(null);
    setIsSubmitting(false);
    setErrors({});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto">
          {/* Backdrop blur & darken */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeContactModal}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-0"
            aria-hidden="true"
          />

          {/* Liquid Glass Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col rounded-[28px] sm:rounded-[36px] bg-[#0d0d12]/92 backdrop-blur-2xl border border-white/12 shadow-[0_30px_90px_rgba(0,0,0,0.85),0_0_60px_rgba(182,0,168,0.12)] text-[#D7E2EA] overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Ambient inner gradient highlight */}
            <div
              className="absolute -top-32 -left-32 w-80 h-80 rounded-full opacity-20 pointer-events-none blur-[90px]"
              style={{
                background:
                  'radial-gradient(circle, #B600A8 0%, #7621B0 50%, transparent 80%)',
              }}
            />
            <div
              className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full opacity-15 pointer-events-none blur-[90px]"
              style={{
                background:
                  'radial-gradient(circle, #7621B0 0%, #3B82F6 50%, transparent 80%)',
              }}
            />

            {/* Modal Header */}
            <div className="flex items-start justify-between p-6 sm:p-8 pb-4 sm:pb-5 border-b border-white/10 relative z-10 flex-shrink-0">
              <div className="flex flex-col gap-1 pr-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium uppercase tracking-wider bg-white/5 border border-white/10 text-[#D7E2EA]/80">
                    <Sparkles className="w-3 h-3 text-[#B600A8]" />
                    Get in touch
                  </span>
                </div>
                <h2
                  id="modal-title"
                  className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white hero-heading"
                >
                  Let&apos;s work together
                </h2>
                <p className="text-xs sm:text-sm text-[#D7E2EA]/70 font-light max-w-lg">
                  Tell me about your project and let&apos;s build something great together.
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={closeContactModal}
                className="rounded-full p-2.5 bg-white/5 hover:bg-white/15 border border-white/10 text-[#D7E2EA] hover:text-white transition-all duration-200 cursor-pointer flex-shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Container */}
            <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-8 custom-modal-scrollbar relative z-10">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} noValidate className="space-y-8">
                  {/* SECTION 1: Contact Details */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#B600A8]" />
                      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#D7E2EA]/90">
                        Your Information
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider font-medium text-[#D7E2EA]/70">
                          Full Name <span className="text-[#FF4D8D]">*</span>
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                          }}
                          placeholder="e.g. Alex Morgan"
                          className={`w-full px-4 py-3 rounded-2xl bg-white/[0.04] border ${
                            errors.name ? 'border-[#FF4D8D]' : 'border-white/10'
                          } text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#B600A8] focus:bg-white/[0.07] transition-all`}
                        />
                        {errors.name && (
                          <p className="text-[11px] text-[#FF4D8D] font-medium">{errors.name}</p>
                        )}
                      </div>

                      {/* Email Address */}
                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider font-medium text-[#D7E2EA]/70">
                          Email Address <span className="text-[#FF4D8D]">*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                          }}
                          placeholder="alex@company.com"
                          className={`w-full px-4 py-3 rounded-2xl bg-white/[0.04] border ${
                            errors.email ? 'border-[#FF4D8D]' : 'border-white/10'
                          } text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#B600A8] focus:bg-white/[0.07] transition-all`}
                        />
                        {errors.email && (
                          <p className="text-[11px] text-[#FF4D8D] font-medium">{errors.email}</p>
                        )}
                      </div>

                      {/* Phone / WhatsApp */}
                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider font-medium text-[#D7E2EA]/70">
                          WhatsApp / Phone <span className="text-[#FF4D8D]">*</span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                          }}
                          placeholder="+91 98765 43210"
                          className={`w-full px-4 py-3 rounded-2xl bg-white/[0.04] border ${
                            errors.phone ? 'border-[#FF4D8D]' : 'border-white/10'
                          } text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#B600A8] focus:bg-white/[0.07] transition-all`}
                        />
                        {errors.phone && (
                          <p className="text-[11px] text-[#FF4D8D] font-medium">{errors.phone}</p>
                        )}
                      </div>

                      {/* Business / Brand Name */}
                      <div className="space-y-1.5">
                        <label className="block text-xs uppercase tracking-wider font-medium text-[#D7E2EA]/70">
                          Business / Brand Name <span className="text-[#FF4D8D]">*</span>
                        </label>
                        <input
                          type="text"
                          value={businessName}
                          onChange={(e) => {
                            setBusinessName(e.target.value);
                            if (errors.businessName)
                              setErrors((prev) => ({ ...prev, businessName: undefined }));
                          }}
                          placeholder="Brand / Studio name"
                          className={`w-full px-4 py-3 rounded-2xl bg-white/[0.04] border ${
                            errors.businessName ? 'border-[#FF4D8D]' : 'border-white/10'
                          } text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#B600A8] focus:bg-white/[0.07] transition-all`}
                        />
                        {errors.businessName && (
                          <p className="text-[11px] text-[#FF4D8D] font-medium">{errors.businessName}</p>
                        )}
                      </div>
                    </div>

                    {/* Optional: Website / Instagram */}
                    <div className="space-y-1.5">
                      <label className="block text-xs uppercase tracking-wider font-medium text-[#D7E2EA]/70">
                        Website / Instagram <span className="text-white/40 lowercase text-[10px]">(optional)</span>
                      </label>
                      <input
                        type="text"
                        value={websiteOrInstagram}
                        onChange={(e) => setWebsiteOrInstagram(e.target.value)}
                        placeholder="https://... or @instagram_handle"
                        className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#B600A8] focus:bg-white/[0.07] transition-all"
                      />
                    </div>
                  </div>

                  {/* SECTION 2: Service Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#B600A8]" />
                        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#D7E2EA]/90">
                          What do you need? <span className="text-[#FF4D8D]">*</span>
                        </h3>
                      </div>
                      <span className="text-[11px] text-white/50 uppercase tracking-wider">
                        Select one or multiple
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {SERVICE_OPTIONS.map((service) => {
                        const isSelected = selectedServices.includes(service.id);
                        return (
                          <button
                            type="button"
                            key={service.id}
                            onClick={() => toggleService(service.id)}
                            className={`flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-white/[0.12] border-[#B600A8] shadow-[0_0_20px_rgba(182,0,168,0.25)] text-white'
                                : 'bg-white/[0.03] border-white/10 text-[#D7E2EA]/75 hover:bg-white/[0.06] hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span
                                className={`w-5 h-5 rounded-md flex items-center justify-center border text-[10px] flex-shrink-0 transition-colors ${
                                  isSelected
                                    ? 'bg-[#B600A8] border-[#B600A8] text-white'
                                    : 'border-white/20 text-transparent'
                                }`}
                              >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                              <div className="truncate">
                                <span className="block text-xs sm:text-sm font-medium tracking-tight truncate">
                                  {service.number} — {service.name}
                                </span>
                                <span className="text-[11px] opacity-60">
                                  ₹{service.minFare.toLocaleString()} – ₹{service.maxFare.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {errors.services && (
                      <p className="text-[11px] text-[#FF4D8D] font-medium">{errors.services}</p>
                    )}
                  </div>

                  {/* SECTION 3: Budget Selection */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#B600A8]" />
                      <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#D7E2EA]/90">
                        What&apos;s your approximate budget? <span className="text-[#FF4D8D]">*</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {BUDGET_OPTIONS.map((option) => {
                        const isSelected = budget === option;
                        return (
                          <button
                            type="button"
                            key={option}
                            onClick={() => {
                              setBudget(option);
                              if (errors.budget) setErrors((prev) => ({ ...prev, budget: undefined }));
                            }}
                            className={`py-3 px-3 rounded-2xl border text-xs sm:text-sm font-medium text-center transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-white/[0.12] border-[#B600A8] shadow-[0_0_20px_rgba(182,0,168,0.25)] text-white'
                                : 'bg-white/[0.03] border-white/10 text-[#D7E2EA]/75 hover:bg-white/[0.06] hover:border-white/20'
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                    {errors.budget && (
                      <p className="text-[11px] text-[#FF4D8D] font-medium">{errors.budget}</p>
                    )}
                  </div>

                  {/* SECTION 4: Project Details Textarea */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#B600A8]" />
                      <label className="block text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#D7E2EA]/90">
                        Project Details <span className="text-[#FF4D8D]">*</span>
                      </label>
                    </div>
                    <textarea
                      rows={4}
                      value={projectDetails}
                      onChange={(e) => {
                        setProjectDetails(e.target.value);
                        if (errors.projectDetails)
                          setErrors((prev) => ({ ...prev, projectDetails: undefined }));
                      }}
                      placeholder="Tell me about your project, requirements, goals or ideas..."
                      className={`w-full px-4 py-3 rounded-2xl bg-white/[0.04] border ${
                        errors.projectDetails ? 'border-[#FF4D8D]' : 'border-white/10'
                      } text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#B600A8] focus:bg-white/[0.07] transition-all resize-y`}
                    />
                    {errors.projectDetails && (
                      <p className="text-[11px] text-[#FF4D8D] font-medium">
                        {errors.projectDetails}
                      </p>
                    )}
                  </div>

                  {/* SECTION 5: Meeting / Call Booking */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-white/[0.02] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                      <div className="flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#B600A8]" />
                        <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-white">
                          Want to discuss the project on a call?
                        </h3>
                      </div>

                      {/* YES / NO Toggle */}
                      <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.05] border border-white/10">
                        <button
                          type="button"
                          onClick={() => setWantsMeeting(true)}
                          className={`px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            wantsMeeting
                              ? 'bg-gradient-to-r from-[#B600A8] to-[#7621B0] text-white shadow-md'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          type="button"
                          onClick={() => setWantsMeeting(false)}
                          className={`px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                            !wantsMeeting
                              ? 'bg-white/15 text-white shadow-sm'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          No
                        </button>
                      </div>
                    </div>

                    {/* Smooth Reveal of Meeting Booking Fields */}
                    <AnimatePresence>
                      {wantsMeeting && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
                          className="overflow-hidden space-y-4 pt-2"
                        >
                          {/* Meeting Type Selection */}
                          <div className="space-y-1.5">
                            <label className="block text-xs uppercase tracking-wider font-medium text-[#D7E2EA]/70">
                              Meeting Platform <span className="text-[#FF4D8D]">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {MEETING_TYPES.map((type) => {
                                const isSelected = meetingType === type;
                                return (
                                  <button
                                    type="button"
                                    key={type}
                                    onClick={() => setMeetingType(type)}
                                    className={`py-2.5 px-3 rounded-xl border text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                                      isSelected
                                        ? 'bg-white/[0.12] border-[#B600A8] text-white shadow-[0_0_15px_rgba(182,0,168,0.2)]'
                                        : 'bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06]'
                                    }`}
                                  >
                                    {type === 'Google Meet' && <Video className="w-3.5 h-3.5 text-blue-400" />}
                                    {type === 'Phone Call' && <Phone className="w-3.5 h-3.5 text-green-400" />}
                                    {type === 'WhatsApp Call' && <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />}
                                    <span>{type}</span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* Preferred Date */}
                          <div className="space-y-1.5">
                            <label className="block text-xs uppercase tracking-wider font-medium text-[#D7E2EA]/70">
                              Preferred Date <span className="text-[#FF4D8D]">*</span>
                            </label>
                            <div className="relative">
                              <input
                                type="date"
                                min={todayString}
                                value={meetingDate}
                                onChange={(e) => {
                                  setMeetingDate(e.target.value);
                                  if (errors.meetingDate)
                                    setErrors((prev) => ({ ...prev, meetingDate: undefined }));
                                }}
                                className={`w-full px-4 py-3 rounded-2xl bg-white/[0.04] border ${
                                  errors.meetingDate ? 'border-[#FF4D8D]' : 'border-white/10'
                                } text-white text-sm focus:outline-none focus:border-[#B600A8] focus:bg-white/[0.07] transition-all`}
                              />
                            </div>
                            {errors.meetingDate && (
                              <p className="text-[11px] text-[#FF4D8D] font-medium">
                                {errors.meetingDate}
                              </p>
                            )}
                          </div>

                          {/* Preferred Time Slot */}
                          <div className="space-y-1.5">
                            <label className="block text-xs uppercase tracking-wider font-medium text-[#D7E2EA]/70">
                              Preferred Time Slot <span className="text-[#FF4D8D]">*</span>
                            </label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5 max-h-44 overflow-y-auto p-1 bg-black/20 rounded-2xl border border-white/5 custom-modal-scrollbar">
                              {TIME_SLOTS.map((slot) => {
                                const isSelected = meetingTime === slot;
                                return (
                                  <button
                                    type="button"
                                    key={slot}
                                    onClick={() => setMeetingTime(slot)}
                                    className={`py-2 px-1 rounded-xl text-[11px] font-medium text-center transition-all duration-150 cursor-pointer ${
                                      isSelected
                                        ? 'bg-[#B600A8] text-white shadow-md font-semibold'
                                        : 'bg-white/[0.03] text-white/70 hover:bg-white/[0.08] hover:text-white'
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* SECTION 6: Project Summary & Estimated Range */}
                  {selectedServices.length > 0 && (
                    <div className="p-5 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#B600A8]" />
                          <h3 className="text-xs uppercase tracking-widest font-semibold text-white">
                            Project Summary
                          </h3>
                        </div>
                        <span className="text-[11px] text-white/50 uppercase tracking-wider">
                          {selectedServices.length} service{selectedServices.length > 1 ? 's' : ''} selected
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-start text-[#D7E2EA]/80">
                          <span className="text-white/60">Selected Services:</span>
                          <span className="font-medium text-right text-white max-w-xs">
                            {selectedServiceObjects.map((s) => s.name).join(', ')}
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[#D7E2EA]/80">
                          <span className="text-white/60">Approximate Budget:</span>
                          <span className="font-medium text-white">{budget}</span>
                        </div>

                        {wantsMeeting && meetingDate && (
                          <div className="flex justify-between items-center text-[#D7E2EA]/80">
                            <span className="text-white/60">Preferred Call:</span>
                            <span className="font-medium text-white">
                              {meetingDate} at {meetingTime} ({meetingType})
                            </span>
                          </div>
                        )}

                        <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                          <span className="text-xs font-semibold uppercase tracking-wider text-white">
                            Estimated project range:
                          </span>
                          <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                            ₹{estimatedMin.toLocaleString()} – ₹{estimatedMax.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-white/45 italic leading-relaxed pt-1">
                        * Final quotation will be confirmed after discussing your specific requirements.
                      </p>
                    </div>
                  )}

                  {/* Testing Contact Info Direct Banner */}
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] text-white/60 flex-wrap gap-2">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#B600A8]" />
                        {CONTACT_CONFIG.email}
                      </span>
                      <span className="hidden sm:inline text-white/20">|</span>
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-emerald-400" />
                        {CONTACT_CONFIG.displayPhone}
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-white/40">Direct Contact</span>
                  </div>

                  {/* Error State Banner */}
                  {submitError && (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p className="font-semibold text-white/95">{submitError}</p>
                          <p className="text-[11px] text-white/70">
                            You can retry sending or connect directly via WhatsApp to ensure your enquiry is received instantly:
                          </p>
                        </div>
                      </div>
                      <div className="pt-1">
                        <a
                          href={`https://wa.me/918260970300?text=${encodeURIComponent(
                            `Hi Suraj! I am contacting you for project enquiry:\n\n• Name: ${name}\n• Business: ${businessName}\n• Services: ${selectedServiceObjects.map((s) => s.name).join(', ')}\n• Budget: ${budget}\n\nRequirements: ${projectDetails}`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Send directly on WhatsApp (+91 8260970300)
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Primary Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full rounded-full py-4 text-sm sm:text-base text-white font-medium uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 shadow-lg ${
                        isSubmitting
                          ? 'opacity-70 cursor-not-allowed'
                          : 'hover:opacity-90 cursor-pointer'
                      }`}
                      style={{
                        background:
                          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                        boxShadow:
                          '0px 4px 14px rgba(181, 1, 167, 0.35), 4px 4px 12px #7721B1 inset',
                        outline: '2px solid white',
                        outlineOffset: '-3px',
                      }}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Enquiry</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* SUCCESS STATE VIEW */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  className="py-8 px-2 flex flex-col items-center text-center space-y-6"
                >
                  {/* Glowing Animated Success Icon */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#B600A8] to-[#7621B0] flex items-center justify-center shadow-[0_0_40px_rgba(182,0,168,0.4)]">
                      <Check className="w-10 h-10 text-white stroke-[2.5]" />
                    </div>
                  </div>

                  <div className="space-y-2 max-w-md">
                    <h3 className="text-2xl sm:text-3xl font-black uppercase text-white tracking-tight hero-heading">
                      Thank You, {submittedData?.name}.
                    </h3>
                    <p className="text-sm text-[#D7E2EA]/80 font-light leading-relaxed">
                      Your enquiry has been received. I&apos;ll get back to you shortly.
                    </p>
                  </div>

                  {/* Submission Summary Card */}
                  {submittedData && (
                    <div className="w-full max-w-lg p-5 rounded-3xl bg-white/[0.04] border border-white/10 text-left space-y-3 text-xs text-[#D7E2EA]/80">
                      <div className="border-b border-white/10 pb-2.5 flex items-center justify-between">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-white">
                          Enquiry Summary
                        </span>
                        <span className="text-[10px] text-white/50">
                          {submittedData.businessName}
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-white/60">Selected Service(s):</span>
                          <span className="font-medium text-white text-right">
                            {submittedData.services.join(', ')}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-white/60">Budget:</span>
                          <span className="font-medium text-white">{submittedData.budget}</span>
                        </div>

                        {submittedData.estimatedRange && (
                          <div className="flex justify-between">
                            <span className="text-white/60">Estimated Range:</span>
                            <span className="font-medium text-white">
                              ₹{submittedData.estimatedRange.min.toLocaleString()} – ₹
                              {submittedData.estimatedRange.max.toLocaleString()}
                            </span>
                          </div>
                        )}

                        {submittedData.wantsMeeting && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-white/60">Meeting Date:</span>
                              <span className="font-medium text-white">
                                {submittedData.meetingDate}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Meeting Time:</span>
                              <span className="font-medium text-white">
                                {submittedData.meetingTime}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/60">Meeting Type:</span>
                              <span className="font-medium text-white">
                                {submittedData.meetingType}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* WhatsApp Quick-Connect Pre-filled Button */}
                  {submittedData && (
                    <a
                      href={`https://wa.me/918260970300?text=${encodeURIComponent(
                        `Hi Suraj! I just submitted an enquiry for ${submittedData.businessName}:\n\n• Name: ${submittedData.name}\n• Services: ${submittedData.services.join(', ')}\n• Budget: ${submittedData.budget}${submittedData.wantsMeeting ? `\n• Call: ${submittedData.meetingDate} at ${submittedData.meetingTime} (${submittedData.meetingType})` : ''}\n\nProject details: ${submittedData.projectDetails}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full max-w-lg py-3 px-5 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 hover:text-emerald-200 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Chat on WhatsApp (+91 8260970300)</span>
                    </a>
                  )}

                  {/* Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm pt-2">
                    <button
                      type="button"
                      onClick={closeContactModal}
                      className="flex-1 rounded-full py-3 px-6 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer"
                    >
                      Done
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 rounded-full py-3 px-6 bg-transparent hover:bg-white/5 border border-white/10 text-white/70 hover:text-white text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-200 cursor-pointer"
                    >
                      New Enquiry
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
