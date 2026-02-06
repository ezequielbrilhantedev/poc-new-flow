import { useState } from "react";
import type { ObjectiveKey } from "../types/campaign";

interface StepObjectiveProps {
  onNext: (objective: ObjectiveKey) => void;
  onBack: () => void;
  initialValue?: ObjectiveKey;
}

const objectives: { value: ObjectiveKey; label: string }[] = [
  { value: "Eventos", label: "Eventos" },
  { value: "DataComemorativaLocais", label: "Datas comemorativas locais" },
  {
    value: "ReenviarEmailNaoLido",
    label: "Reenviar para quem não abriu o e-mail",
  },
  {
    value: "SorteiosPremiacoesRegionais",
    label: "Sorteios ou premiações regionais",
  },
  { value: "OfertasProdutos", label: "Ofertas de produtos" },
];

function StepObjective({ onNext, onBack, initialValue }: StepObjectiveProps) {
  const [selectedObjective, setSelectedObjective] = useState<ObjectiveKey | "">(
    initialValue || "",
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleContinue = () => {
    if (selectedObjective) {
      onNext(selectedObjective as ObjectiveKey);
    }
  };

  const selectedLabel = objectives.find(
    (obj) => obj.value === selectedObjective,
  )?.label;

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-6">
          Qual será o objetivo da ação
        </h2>

        <div className="relative max-w-md">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full px-4 py-3 pr-12 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <span
              className={selectedObjective ? "text-gray-900" : "text-gray-400"}
            >
              {selectedLabel || "Selecionar"}
            </span>
          </button>
          <span className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <svg
              className={`w-5 h-5 text-gray-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>

          {isOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
              {objectives.map((objective) => (
                <button
                  key={objective.value}
                  type="button"
                  onClick={() => {
                    setSelectedObjective(objective.value);
                    setIsOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 first:rounded-t-md last:rounded-b-md"
                >
                  {objective.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white py-4 px-8 flex justify-between items-center mt-auto">
        <button
          onClick={onBack}
          className="px-6 py-2 text-gray-600 hover:text-gray-800"
        >
          Voltar
        </button>
        <button
          onClick={handleContinue}
          disabled={!selectedObjective}
          className={`px-8 py-3 rounded-md font-medium ${
            selectedObjective
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}

export default StepObjective;
