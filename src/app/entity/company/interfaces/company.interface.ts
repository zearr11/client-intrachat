export interface CompanyRequest {
  nombres:            string;
}

export interface CompanyRequest2 {
  nombres:            string;
  estado:             boolean;
}

export interface CompanyResponse {
  id:                 number;
  empresa:            string;
  estado:             boolean;
}
