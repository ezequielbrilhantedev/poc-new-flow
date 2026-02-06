export type ObjectiveKey = 
  | 'Eventos' 
  | 'DataComemorativaLocais' 
  | 'ReenviarEmailNaoLido' 
  | 'SorteiosPremiacoesRegionais' 
  | 'OfertasProdutos';

export type ProfileSegment = 'PF1' | 'PF2' | 'PF3';

export type BrazilState = 
  | 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO' 
  | 'MA' | 'MT' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI' 
  | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO';

export type ConditionOperator = 
  | 'é igual a' 
  | 'não é igual a' 
  | 'contém' 
  | 'não contém';

export type LogicalOperator = 'E' | 'OU';

export interface QueryCondition {
  id: string;
  attribute: string;
  operator: ConditionOperator;
  value: string[];
}

export interface QueryGroup {
  id: string;
  conditions: QueryCondition[];
  logicalOperator?: LogicalOperator;
}

export interface CampaignData {
  objective?: {
    objectiveKey: string;
  };
  audience?: {
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
  };
}

export interface AttributeOption {
  id: string;
  label: string;
  category: 'cadastro' | 'produto' | 'relacionamento' | 'engajamento';
  type: 'text' | 'select' | 'multiselect';
  options?: { value: string; label: string }[];
}
