import { useState } from "react";
import Stepper from "./Stepper";
import StepObjective from "./StepObjective";
import StepAudience, { type AudienceData } from "./StepAudience";
import type { CampaignData, ObjectiveKey } from "../types/campaign";

function CampaignFlow() {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({});

  const steps: Array<{
    id: number;
    label: string;
    status: "completed" | "current" | "pending";
  }> = [
    {
      id: 1,
      label: "Objetivo",
      status:
        currentStep > 1
          ? "completed"
          : currentStep === 1
            ? "current"
            : "pending",
    },
    {
      id: 2,
      label: "Público",
      status:
        currentStep > 2
          ? "completed"
          : currentStep === 2
            ? "current"
            : "pending",
    },
    {
      id: 3,
      label: "Canal e Templates",
      status:
        currentStep > 3
          ? "completed"
          : currentStep === 3
            ? "current"
            : "pending",
    },
    {
      id: 4,
      label: "Envio",
      status:
        currentStep > 4
          ? "completed"
          : currentStep === 4
            ? "current"
            : "pending",
    },
  ];

  const handleObjectiveNext = (objective: ObjectiveKey) => {
    setCampaignData({
      ...campaignData,
      objective: {
        objectiveKey: objective,
      },
    });
    setCurrentStep(2);
  };

  const handleAudienceNext = async (audienceData: AudienceData) => {
    const updatedCampaignData: CampaignData = {
      ...campaignData,
      audience: audienceData,
    };

    setCampaignData(updatedCampaignData);

    try {
      const response = await fetch("http://localhost:8080/api/campaign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCampaignData),
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar dados para API");
      }

      const result = await response.json();
      console.log("Resposta da API:", result);

      setCurrentStep(3);
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert(
        "Erro ao enviar dados para o servidor. Verifique se a API está rodando.",
      );
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-white">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Voltar
          </button>

          <Stepper steps={steps} />

          <div className="mt-8 pb-8">
            {currentStep === 1 && (
              <StepObjective
                onNext={handleObjectiveNext}
                onBack={handleBack}
                initialValue={
                  campaignData.objective?.objectiveKey as ObjectiveKey
                }
              />
            )}

            {currentStep === 2 && (
              <StepAudience onNext={handleAudienceNext} onBack={handleBack} />
            )}

            {currentStep === 3 && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">
                  Canal e Templates
                </h2>
                <p className="text-gray-600">
                  Esta etapa será implementada em breve...
                </p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">Envio</h2>
                <p className="text-gray-600">
                  Esta etapa será implementada em breve...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CampaignFlow;
