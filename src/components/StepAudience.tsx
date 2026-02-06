import { useState } from "react";
import type {
  QueryGroup,
  QueryCondition,
  ConditionOperator,
  LogicalOperator,
  ProfileSegment,
  BrazilState,
} from "../types/campaign";

interface StepAudienceProps {
  onNext: (data: AudienceData) => void;
  onBack: () => void;
}

export interface AudienceData {
  audienceName: string;
  attributes: {
    registrationFields: {
      name: string;
      email: string;
      phone: string;
      state: string;
    };
    productFields: string[];
    relationshipFields: {
      profileSegment: ProfileSegment[];
    };
  };
  segmentExpression: string;
}

const PROFILE_SEGMENTS: ProfileSegment[] = ["PF1", "PF2", "PF3"];

const BRAZIL_STATES: { value: BrazilState; label: string }[] = [
  { value: "AC", label: "Acre" },
  { value: "AL", label: "Alagoas" },
  { value: "AP", label: "Amapá" },
  { value: "AM", label: "Amazonas" },
  { value: "BA", label: "Bahia" },
  { value: "CE", label: "Ceará" },
  { value: "DF", label: "Distrito Federal" },
  { value: "ES", label: "Espírito Santo" },
  { value: "GO", label: "Goiás" },
  { value: "MA", label: "Maranhão" },
  { value: "MT", label: "Mato Grosso" },
  { value: "MS", label: "Mato Grosso do Sul" },
  { value: "MG", label: "Minas Gerais" },
  { value: "PA", label: "Pará" },
  { value: "PB", label: "Paraíba" },
  { value: "PR", label: "Paraná" },
  { value: "PE", label: "Pernambuco" },
  { value: "PI", label: "Piauí" },
  { value: "RJ", label: "Rio de Janeiro" },
  { value: "RN", label: "Rio Grande do Norte" },
  { value: "RS", label: "Rio Grande do Sul" },
  { value: "RO", label: "Rondônia" },
  { value: "RR", label: "Roraima" },
  { value: "SC", label: "Santa Catarina" },
  { value: "SP", label: "São Paulo" },
  { value: "SE", label: "Sergipe" },
  { value: "TO", label: "Tocantins" },
];

const PRODUCTS = [
  "Consórcio",
  "Seguro Residencial",
  "Seguro Auto",
  "Previdência",
  "Conta Corrente",
  "Cartão de Crédito",
];

const OPERATORS: { value: ConditionOperator; label: string }[] = [
  { value: "é igual a", label: "é igual a" },
  { value: "não é igual a", label: "não é igual a" },
  { value: "contém", label: "contém" },
  { value: "não contém", label: "não contém" },
];

const ATTRIBUTES = [
  {
    value: "Perfil_segmento",
    label: "Perfil_segmento",
    type: "profileSegment",
  },
  { value: "Estado", label: "Estado", type: "state" },
  { value: "Produto", label: "Produto", type: "product" },
];

function StepAudience({ onNext, onBack }: StepAudienceProps) {
  const [selectedAttributes, setSelectedAttributes] = useState({
    nome: false,
    email: false,
    telefone: false,
    estado: false,
    consorcio: false,
    seguroResidencial: false,
    perfilSegmento: false,
  });

  const [queryGroups, setQueryGroups] = useState<QueryGroup[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const addConditionForAttribute = (attributeName: string) => {
    const newCondition: QueryCondition = {
      id: Date.now().toString(),
      attribute: attributeName,
      operator: "é igual a",
      value: [],
    };

    if (queryGroups.length === 0) {
      setQueryGroups([
        {
          id: Date.now().toString(),
          conditions: [newCondition],
        },
      ]);
    } else {
      const lastGroup = queryGroups[queryGroups.length - 1];
      setQueryGroups([
        ...queryGroups.slice(0, -1),
        {
          ...lastGroup,
          conditions: [...lastGroup.conditions, newCondition],
        },
      ]);
    }
  };

  const removeConditionByAttribute = (attributeName: string) => {
    setQueryGroups(
      queryGroups
        .map((group) => ({
          ...group,
          conditions: group.conditions.filter(
            (cond) => cond.attribute !== attributeName,
          ),
        }))
        .filter((group) => group.conditions.length > 0),
    );
  };

  const handleAttributeChange = (
    attributeKey: string,
    checked: boolean,
    attributeName: string,
  ) => {
    setSelectedAttributes({ ...selectedAttributes, [attributeKey]: checked });

    if (checked) {
      addConditionForAttribute(attributeName);
    } else {
      removeConditionByAttribute(attributeName);
    }
  };

  const addCondition = () => {
    const newCondition: QueryCondition = {
      id: Date.now().toString(),
      attribute: "",
      operator: "é igual a",
      value: [],
    };

    if (queryGroups.length === 0) {
      setQueryGroups([
        {
          id: Date.now().toString(),
          conditions: [newCondition],
        },
      ]);
    } else {
      const lastGroup = queryGroups[queryGroups.length - 1];
      setQueryGroups([
        ...queryGroups.slice(0, -1),
        {
          ...lastGroup,
          conditions: [...lastGroup.conditions, newCondition],
        },
      ]);
    }
  };

  const updateCondition = (
    groupId: string,
    conditionId: string,
    field: keyof QueryCondition,
    value: string | string[] | ConditionOperator,
  ) => {
    setQueryGroups(
      queryGroups.map((group) =>
        group.id === groupId
          ? {
              ...group,
              conditions: group.conditions.map((cond) =>
                cond.id === conditionId ? { ...cond, [field]: value } : cond,
              ),
            }
          : group,
      ),
    );
  };

  const deleteCondition = (groupId: string, conditionId: string) => {
    setQueryGroups(
      queryGroups
        .map((group) =>
          group.id === groupId
            ? {
                ...group,
                conditions: group.conditions.filter(
                  (cond) => cond.id !== conditionId,
                ),
              }
            : group,
        )
        .filter((group) => group.conditions.length > 0),
    );
  };

  const addLogicalOperator = (operator: LogicalOperator) => {
    const newGroup: QueryGroup = {
      id: Date.now().toString(),
      conditions: [
        {
          id: Date.now().toString() + "_1",
          attribute: "",
          operator: "é igual a",
          value: [],
        },
      ],
      logicalOperator: operator,
    };
    setQueryGroups([...queryGroups, newGroup]);
  };

  const buildSegmentExpression = (): string => {
    let expression = "";

    queryGroups.forEach((group, groupIndex) => {
      if (groupIndex > 0 && group.logicalOperator) {
        expression += ` ${group.logicalOperator} `;
      }

      const groupExpressions = group.conditions
        .filter((cond) => cond.attribute && cond.value.length > 0)
        .map((cond) => {
          const attr = cond.attribute.toLowerCase().replace("_", "");

          if (cond.operator === "é igual a") {
            if (cond.value.length === 1) {
              return `${attr} = '${cond.value[0]}'`;
            }
            return `${attr} IN (${cond.value.map((v) => `'${v}'`).join(",")})`;
          } else if (cond.operator === "não contém") {
            return cond.value
              .map((v) => `${attr} NOT LIKE '%${v}%'`)
              .join(" AND ");
          }
          return "";
        })
        .filter(Boolean);

      if (groupExpressions.length > 0) {
        expression += groupExpressions.join(" AND ");
      }
    });

    return expression;
  };

  const handleContinue = () => {
    if (
      queryGroups.length === 0 ||
      queryGroups.every((g) => g.conditions.every((c) => !c.attribute))
    ) {
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    const profileSegments: ProfileSegment[] = [];
    const productFields: string[] = [];
    let state = "";

    queryGroups.forEach((group) => {
      group.conditions.forEach((cond) => {
        if (cond.attribute === "Perfil_segmento") {
          profileSegments.push(...(cond.value as ProfileSegment[]));
        } else if (cond.attribute === "Produto") {
          productFields.push(...cond.value);
        } else if (cond.attribute === "Estado") {
          state = cond.value[0] || "";
        }
      });
    });

    const audienceData: AudienceData = {
      audienceName: "Campanha_Renegociacao_PR_PF",
      attributes: {
        registrationFields: {
          name: "",
          email: "",
          phone: "",
          state: state,
        },
        productFields: productFields,
        relationshipFields: {
          profileSegment: profileSegments,
        },
      },
      segmentExpression: buildSegmentExpression(),
    };

    onNext(audienceData);
  };

  return (
    <div className="flex gap-8">
      <div className="w-64">
        <h3 className="font-semibold mb-4">Atributos</h3>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Campos de cadastro
          </p>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={selectedAttributes.nome}
              onChange={(e) =>
                handleAttributeChange("nome", e.target.checked, "Nome")
              }
              className="w-4 h-4"
            />
            <span className="text-sm">Nome</span>
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={selectedAttributes.email}
              onChange={(e) =>
                handleAttributeChange("email", e.target.checked, "E-mail")
              }
              className="w-4 h-4"
            />
            <span className="text-sm">E-mail</span>
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={selectedAttributes.telefone}
              onChange={(e) =>
                handleAttributeChange("telefone", e.target.checked, "Telefone")
              }
              className="w-4 h-4"
            />
            <span className="text-sm">Telefone</span>
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={selectedAttributes.estado}
              onChange={(e) =>
                handleAttributeChange("estado", e.target.checked, "Estado")
              }
              className="w-4 h-4"
            />
            <span className="text-sm">Estado</span>
          </label>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Campos de Produto
          </p>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={selectedAttributes.consorcio}
              onChange={(e) =>
                handleAttributeChange("consorcio", e.target.checked, "Produto")
              }
              className="w-4 h-4"
            />
            <span className="text-sm">Consórcio</span>
          </label>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={selectedAttributes.seguroResidencial}
              onChange={(e) =>
                handleAttributeChange(
                  "seguroResidencial",
                  e.target.checked,
                  "Produto",
                )
              }
              className="w-4 h-4"
            />
            <span className="text-sm">Seguro residencial</span>
          </label>
        </div>

        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Campos de relacionamento
          </p>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="checkbox"
              checked={selectedAttributes.perfilSegmento}
              onChange={(e) =>
                handleAttributeChange(
                  "perfilSegmento",
                  e.target.checked,
                  "Perfil_segmento",
                )
              }
              className="w-4 h-4"
            />
            <span className="text-sm">Perfil_Segmento</span>
          </label>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Campos de engajamento
          </p>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Criar segmento</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setQueryGroups([])}
              className="text-sm text-green-600 hover:text-green-700"
            >
              Limpar tudo
            </button>
            <button
              onClick={handleContinue}
              className="text-sm text-green-600 hover:text-green-700"
            >
              Salvar
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 min-h-[400px]">
          {queryGroups.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-400">
                <svg
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <p>Selecione os atributos para criar segmento</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {queryGroups.map((group, groupIndex) => (
                <div key={group.id}>
                  {groupIndex > 0 && group.logicalOperator && (
                    <div className="flex justify-center my-2">
                      <select
                        value={group.logicalOperator}
                        onChange={(e) => {
                          const newGroups = [...queryGroups];
                          newGroups[groupIndex].logicalOperator = e.target
                            .value as LogicalOperator;
                          setQueryGroups(newGroups);
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="E">E</option>
                        <option value="OU">OU</option>
                      </select>
                    </div>
                  )}

                  <div className="space-y-3">
                    {group.conditions.map((condition, condIndex) => (
                      <ConditionRow
                        key={condition.id}
                        condition={condition}
                        onUpdate={(field, value) =>
                          updateCondition(group.id, condition.id, field, value)
                        }
                        onDelete={() => deleteCondition(group.id, condition.id)}
                        showLogicalOperator={condIndex > 0}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex gap-2 mt-4">
                <button
                  onClick={addCondition}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  + Adicionar condição
                </button>
                <button
                  onClick={() => addLogicalOperator("E")}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  + Adicionar grupo (E)
                </button>
                <button
                  onClick={() => addLogicalOperator("OU")}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  + Adicionar grupo (OU)
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={onBack}
            className="px-6 py-2 text-gray-600 hover:text-gray-800"
          >
            Voltar
          </button>
          <button
            onClick={handleContinue}
            disabled={queryGroups.length === 0}
            className={`px-8 py-3 rounded-md font-medium ${
              queryGroups.length > 0
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Continuar
          </button>
        </div>
      </div>

      {showConfirmModal && (
        <ConfirmModal
          queryGroups={queryGroups}
          onConfirm={handleConfirm}
          onAdjust={() => setShowConfirmModal(false)}
          onClose={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
}

interface ConditionRowProps {
  condition: QueryCondition;
  onUpdate: (
    field: keyof QueryCondition,
    value: string | string[] | ConditionOperator,
  ) => void;
  onDelete: () => void;
  showLogicalOperator: boolean;
}

function ConditionRow({
  condition,
  onUpdate,
  onDelete,
  showLogicalOperator,
}: ConditionRowProps) {
  const [isAttributeOpen, setIsAttributeOpen] = useState(false);
  const [isOperatorOpen, setIsOperatorOpen] = useState(false);
  const [isValueOpen, setIsValueOpen] = useState(false);

  const selectedAttribute = ATTRIBUTES.find(
    (attr) => attr.value === condition.attribute,
  );
  const selectedOperator = OPERATORS.find(
    (op) => op.value === condition.operator,
  );

  const getValueOptions = () => {
    if (!selectedAttribute) return [];

    if (selectedAttribute.type === "profileSegment") {
      return PROFILE_SEGMENTS.map((ps) => ({ value: ps, label: ps }));
    } else if (selectedAttribute.type === "state") {
      return BRAZIL_STATES;
    } else if (selectedAttribute.type === "product") {
      return PRODUCTS.map((p) => ({ value: p, label: p }));
    }
    return [];
  };

  const valueOptions = getValueOptions();
  const selectedValues = condition.value;

  return (
    <div className="flex items-center gap-3">
      {showLogicalOperator && (
        <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
          <option value="E">E</option>
        </select>
      )}

      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setIsAttributeOpen(!isAttributeOpen)}
          className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md text-sm"
        >
          {selectedAttribute?.label || "Selecionar atributo"}
          <span className="float-right">▼</span>
        </button>
        {isAttributeOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {ATTRIBUTES.map((attr) => (
              <button
                key={attr.value}
                type="button"
                onClick={() => {
                  onUpdate("attribute", attr.value);
                  onUpdate("value", []);
                  setIsAttributeOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
              >
                {attr.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setIsOperatorOpen(!isOperatorOpen)}
          className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md text-sm"
        >
          {selectedOperator?.label || "Operador"}
          <span className="float-right">▼</span>
        </button>
        {isOperatorOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
            {OPERATORS.map((op) => (
              <button
                key={op.value}
                type="button"
                onClick={() => {
                  onUpdate("operator", op.value);
                  setIsOperatorOpen(false);
                }}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
              >
                {op.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setIsValueOpen(!isValueOpen)}
          disabled={!selectedAttribute}
          className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
        >
          {selectedValues.length > 0
            ? selectedValues.join("; ")
            : "Selecionar valor"}
          <span className="float-right">▼</span>
        </button>
        {isValueOpen && selectedAttribute && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {valueOptions.map((option) => (
              <label
                key={option.value}
                className="flex items-center px-4 py-2 hover:bg-gray-50 text-sm cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option.value)}
                  onChange={(e) => {
                    const newValues = e.target.checked
                      ? [...selectedValues, option.value]
                      : selectedValues.filter((v) => v !== option.value);
                    onUpdate("value", newValues);
                  }}
                  className="mr-2"
                />
                {option.label}
              </label>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={onDelete}
        className="p-2 text-red-600 hover:text-red-700"
        title="Deletar condição"
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
}

interface ConfirmModalProps {
  queryGroups: QueryGroup[];
  onConfirm: () => void;
  onAdjust: () => void;
  onClose: () => void;
}

function ConfirmModal({
  queryGroups,
  onConfirm,
  onAdjust,
  onClose,
}: ConfirmModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-linear-to-l from-neutral-900/70 via-neutral-800/45 to-transparent">
      <div className="h-full w-full max-w-md bg-white shadow-2xl overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-semibold">Confirme o segmento</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <p className="text-gray-600 text-sm mb-6">
            Confirme abaixo a configuração de segmento criada por você antes de
            dar continuidade na solicitação de conversa
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium mb-3 text-sm">Texto dos segmentos:</h3>
            <div className="space-y-3 text-sm">
              {queryGroups.map((group, groupIndex) => (
                <div key={group.id}>
                  {groupIndex > 0 && group.logicalOperator && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-gray-200 rounded text-xs font-semibold">
                        {group.logicalOperator}
                      </span>
                      <span className="text-gray-400">não contém</span>
                      <span className="px-3 py-1 bg-gray-200 rounded text-xs font-semibold">
                        E
                      </span>
                    </div>
                  )}
                  {group.conditions.map((cond, condIndex) => (
                    <div key={cond.id} className="flex items-start gap-2 mb-2">
                      <svg
                        className="w-4 h-4 text-gray-600 mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-xs">
                          {cond.attribute}
                        </span>
                        <span className="text-gray-600 text-xs">
                          {cond.operator}
                        </span>
                        {cond.value.map((val, valIndex) => (
                          <span
                            key={valIndex}
                            className="px-2 py-1 bg-gray-800 text-white rounded text-xs font-medium"
                          >
                            {val}
                          </span>
                        ))}
                        {condIndex < group.conditions.length - 1 && (
                          <span className="px-2 py-1 bg-gray-200 rounded text-xs font-semibold">
                            E
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium text-sm"
            >
              Confirmar e continuar
            </button>
            <button
              onClick={onAdjust}
              className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium text-sm"
            >
              Ajustar segmentos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepAudience;
