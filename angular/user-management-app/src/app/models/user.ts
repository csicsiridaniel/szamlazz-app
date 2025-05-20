export type Job = 'KERTESZ' | 'HENTES' | 'PEK';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  address: string;
  telephone: string;
  active: boolean;
  job: Job;
}
