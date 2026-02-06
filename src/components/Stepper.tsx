interface Step {
  id: number;
  label: string;
  status: "completed" | "current" | "pending";
}

interface StepperProps {
  steps: Step[];
}

function Stepper({ steps }: StepperProps) {
  return (
    <div className="mb-12">
      <p className="text-sm text-gray-600 mb-6">Solicitar conversa</p>
      <div className="flex items-center justify-between w-full max-w-4xl">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center min-w-[100px]">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                  step.status === "completed"
                    ? "bg-green-600 border-green-600"
                    : step.status === "current"
                      ? "bg-white border-green-600"
                      : "bg-white border-gray-300"
                }`}
              >
                {step.status === "completed" ? (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : step.status === "current" ? (
                  <div className="w-6 h-6 rounded-full bg-green-600"></div>
                ) : null}
              </div>
              <p
                className={`mt-3 text-sm font-medium ${
                  step.status === "pending" ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {step.label}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-6 ${
                  step.status === "completed" ? "bg-green-600" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stepper;
