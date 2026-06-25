import React, { useState } from "react";
import OwnerForm from "./OwnerForm";
import BasicDetailsForm from "./BasicDetailsForm";
import AddressForm from "./AddressForm";
import ImagesForm from "./ImagesForm";
import FinalSubmitForm from "./FinalSubmitForm";

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    owner: {},
    basic: {},
    address: {},
    images: [],
  });

  const handleNext = (data) => {
    setFormData((prev) => {
      const updated = { ...prev };
      if (step === 1) updated.owner = data;
      if (step === 2) updated.basic = data;
      if (step === 3) updated.address = data;
      return updated;
    });
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleImageUploadComplete = (urls) => {
    setFormData((prev) => ({ ...prev, images: urls }));
  };

  const handleReset = () => {
    setStep(1);
    setFormData({
      owner: {},
      basic: {},
      address: {},
      images: [],
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-4 text-sm font-medium text-gray-700">
        Listing Progress: Step {step} of 5
      </div>

      {step === 1 && <OwnerForm onNext={handleNext} />}
      {step === 2 && <BasicDetailsForm onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <AddressForm onNext={handleNext} onBack={handleBack} />}
      {step === 4 && (
        <ImagesForm
          onNext={() => setStep(5)}
          onBack={handleBack}
          onImageUploadComplete={handleImageUploadComplete}
        />
      )}
      {step === 5 && (
        <FinalSubmitForm
          data={formData}
          onBack={() => setStep(4)}
          onSuccess={handleReset}
        />
      )}
    </div>
  );
};

export default MultiStepForm;
