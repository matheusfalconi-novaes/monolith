export interface AddClientUseCaseInputDto {
  id?: string;
  name: string;
  email: string;
  document: string;
  street: string;
  city: string;
  complement: string;
  number: number;
  state: string;
  zipCode: string;
}

export interface AddClientUseCaseOutputDto {
  id: string;
  name: string;
  email: string;
  document: string;
  street: string;
  city: string;
  complement: string;
  number: number;
  state: string;
  zipCode: string;
  createdAt: Date;
  updatedAt: Date;
}
