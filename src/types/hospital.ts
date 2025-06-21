
export interface Patient {
  id: string;
  nombre: string;
  apellido: string;
  dni: string;
  obraSocial: string;
  razonIngreso: string;
  fechaIngreso?: Date;
  estado: 'esperando' | 'internado' | 'alta';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
}

export interface Bed {
  id: string;
  numero: string;
  sector: string;
  estado: 'libre' | 'ocupada' | 'limpieza' | 'mantenimiento';
  paciente?: Patient;
  fechaUltimaLimpieza?: Date;
  observaciones?: string;
}

export interface Sector {
  id: string;
  nombre: string;
  camasTotal: number;
  camasOcupadas: number;
  camasDisponibles: number;
  camasEnLimpieza: number;
  color: string;
}

export interface UserRole {
  id: string;
  nombre: string;
  rol: 'doctor' | 'administracion' | 'limpieza' | 'supervisor';
  permisos: Permission[];
}

export interface Permission {
  action: 'dar_alta' | 'asignar_cama' | 'marcar_limpia' | 'cargar_paciente' | 'ver_todo';
  description: string;
}

export interface AIRecommendation {
  pacienteId: string;
  camaId: string;
  score: number;
  razon: string;
  factores: string[];
}
