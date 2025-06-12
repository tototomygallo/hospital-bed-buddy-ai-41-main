
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Bed, User, Clock, CheckCircle, AlertCircle, Wrench, Brain, Target } from 'lucide-react';
import { Sector, Bed as BedType, Patient, AIRecommendation } from '@/types/hospital';
import BedManagement from './BedManagement';
import { useToast } from '@/hooks/use-toast';

interface BedGridProps {
  sectores: Sector[];
  userRole: 'doctor' | 'administracion' | 'limpieza' | 'supervisor';
}

const BedGrid: React.FC<BedGridProps> = ({ sectores, userRole }) => {
  const { toast } = useToast();
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [selectedBed, setSelectedBed] = useState<BedType | null>(null);

  // Datos de ejemplo de pacientes en espera
  const pacientesEspera: Patient[] = [
    {
      id: '1',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      dni: '20123456',
      obraSocial: 'PAMI',
      razonIngreso: 'Dolor abdominal severo',
      estado: 'esperando',
      prioridad: 'alta'
    },
    {
      id: '2',
      nombre: 'Ana',
      apellido: 'López',
      dni: '25987654',
      obraSocial: 'Galeno',
      razonIngreso: 'Control post-operatorio',
      estado: 'esperando',
      prioridad: 'media'
    },
    {
      id: '3',
      nombre: 'Roberto',
      apellido: 'Martínez',
      dni: '18456789',
      obraSocial: 'Swiss Medical',
      razonIngreso: 'Neumonía leve',
      estado: 'esperando',
      prioridad: 'baja'
    }
  ];

  // Datos de ejemplo de camas
  const [camas] = useState<BedType[]>([
    {
      id: '1',
      numero: 'TI-001',
      sector: 'Terapia Intensiva',
      estado: 'ocupada',
      paciente: {
        id: '1',
        nombre: 'Juan',
        apellido: 'Pérez',
        dni: '12345678',
        obraSocial: 'OSDE',
        razonIngreso: 'Cirugía cardíaca',
        estado: 'internado',
        prioridad: 'alta'
      }
    },
    {
      id: '2',
      numero: 'TI-002',
      sector: 'Terapia Intensiva',
      estado: 'limpieza',
      fechaUltimaLimpieza: new Date()
    },
    {
      id: '3',
      numero: 'TI-003',
      sector: 'Terapia Intensiva',
      estado: 'libre'
    },
    {
      id: '4',
      numero: 'CM-001',
      sector: 'Clínica Médica',
      estado: 'ocupada',
      paciente: {
        id: '2',
        nombre: 'María',
        apellido: 'González',
        dni: '87654321',
        obraSocial: 'Swiss Medical',
        razonIngreso: 'Neumonía',
        estado: 'internado',
        prioridad: 'media'
      }
    },
    {
      id: '5',
      numero: 'CM-002',
      sector: 'Clínica Médica',
      estado: 'libre'
    },
    {
      id: '6',
      numero: 'CIR-001',
      sector: 'Cirugía',
      estado: 'mantenimiento',
      observaciones: 'Reparación de sistema de oxígeno'
    }
  ]);

  // Generar recomendaciones de IA para una cama específica
  const generateRecommendationsForBed = (bed: BedType): AIRecommendation[] => {
    if (bed.estado !== 'libre') return [];

    const recommendations: AIRecommendation[] = [];
    
    pacientesEspera.forEach(paciente => {
      let score = 60; // Base score
      const factores: string[] = [];

      // Factor prioridad
      if (paciente.prioridad === 'critica') {
        score += 20;
        factores.push('Prioridad crítica requiere atención inmediata');
      } else if (paciente.prioridad === 'alta') {
        score += 15;
        factores.push('Prioridad alta del paciente');
      } else if (paciente.prioridad === 'media') {
        score += 10;
        factores.push('Prioridad media estándar');
      } else {
        score += 5;
        factores.push('Prioridad baja, admisión programada');
      }

      // Factor compatibilidad sector-patología
      if (bed.sector === 'Terapia Intensiva' && 
          (paciente.razonIngreso.toLowerCase().includes('severo') || 
           paciente.razonIngreso.toLowerCase().includes('crítico'))) {
        score += 15;
        factores.push('Caso requiere monitoreo intensivo');
      } else if (bed.sector === 'Clínica Médica' && 
                 (paciente.razonIngreso.toLowerCase().includes('control') ||
                  paciente.razonIngreso.toLowerCase().includes('leve'))) {
        score += 12;
        factores.push('Sector adecuado para el tipo de patología');
      } else if (bed.sector === 'Cirugía' && 
                 paciente.razonIngreso.toLowerCase().includes('operatorio')) {
        score += 12;
        factores.push('Especialización en cuidados post-operatorios');
      }

      // Factor obra social (simulado)
      if (['OSDE', 'Swiss Medical', 'Galeno'].includes(paciente.obraSocial)) {
        score += 8;
        factores.push('Obra social compatible con sector');
      }

      // Factor disponibilidad inmediata
      score += 5;
      factores.push('Cama disponible inmediatamente');

      // Generar razón principal
      let razon = '';
      if (score >= 90) {
        razon = `Asignación óptima para ${paciente.nombre} ${paciente.apellido}`;
      } else if (score >= 80) {
        razon = `Muy buena opción para el caso de ${paciente.razonIngreso.toLowerCase()}`;
      } else if (score >= 70) {
        razon = `Opción aceptable considerando disponibilidad`;
      } else {
        razon = `Requiere evaluación adicional para esta asignación`;
      }

      recommendations.push({
        pacienteId: paciente.id,
        camaId: bed.id,
        score: Math.min(score, 100),
        razon,
        factores
      });
    });

    // Ordenar por score descendente
    return recommendations.sort((a, b) => b.score - a.score);
  };

  const handleAsignarPaciente = (recommendation: AIRecommendation) => {
    const paciente = pacientesEspera.find(p => p.id === recommendation.pacienteId);
    const cama = camas.find(c => c.id === recommendation.camaId);
    
    toast({
      title: "Paciente asignado",
      description: `${paciente?.nombre} ${paciente?.apellido} ha sido asignado a la cama ${cama?.numero}.`,
    });
  };

  const getStatusIcon = (estado: BedType['estado']) => {
    switch (estado) {
      case 'ocupada':
        return <User className="h-4 w-4 text-red-600" />;
      case 'libre':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'limpieza':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'mantenimiento':
        return <Wrench className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (estado: BedType['estado']) => {
    switch (estado) {
      case 'ocupada':
        return 'bg-red-100 border-red-300 hover:bg-red-50';
      case 'libre':
        return 'bg-green-100 border-green-300 hover:bg-green-50';
      case 'limpieza':
        return 'bg-yellow-100 border-yellow-300 hover:bg-yellow-50';
      case 'mantenimiento':
        return 'bg-orange-100 border-orange-300 hover:bg-orange-50';
      default:
        return 'bg-gray-100 border-gray-300 hover:bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredCamas = selectedSector 
    ? camas.filter(cama => cama.sector === selectedSector)
    : camas;

  const uniqueSectors = [...new Set(camas.map(cama => cama.sector))];

  return (
    <div className="space-y-6">
      {/* Filtros de Sector */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar por Sector</CardTitle>
          <CardDescription>
            Selecciona un sector para ver sus camas específicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedSector === null ? "default" : "outline"}
              onClick={() => setSelectedSector(null)}
              size="sm"
            >
              Todos los Sectores
            </Button>
            {uniqueSectors.map((sector) => (
              <Button
                key={sector}
                variant={selectedSector === sector ? "default" : "outline"}
                onClick={() => setSelectedSector(sector)}
                size="sm"
              >
                {sector}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grid de Camas */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedSector ? `Camas - ${selectedSector}` : 'Todas las Camas'}
          </CardTitle>
          <CardDescription>
            Estado actual de las camas hospitalarias
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredCamas.map((cama) => (
              <Dialog key={cama.id}>
                <DialogTrigger asChild>
                  <div
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${getStatusColor(cama.estado)}`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Bed className="h-5 w-5 text-gray-600" />
                        <span className="font-semibold">{cama.numero}</span>
                      </div>
                      {getStatusIcon(cama.estado)}
                    </div>
                    
                    <div className="space-y-2">
                      <Badge 
                        variant={cama.estado === 'libre' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {cama.estado.charAt(0).toUpperCase() + cama.estado.slice(1)}
                      </Badge>
                      
                      {cama.paciente && (
                        <div className="text-sm">
                          <p className="font-medium">
                            {cama.paciente.nombre} {cama.paciente.apellido}
                          </p>
                          <p className="text-gray-600 text-xs">
                            {cama.paciente.razonIngreso}
                          </p>
                        </div>
                      )}
                      
                      {cama.estado === 'limpieza' && (
                        <p className="text-xs text-yellow-700">
                          En proceso de limpieza
                        </p>
                      )}
                      
                      {cama.estado === 'mantenimiento' && cama.observaciones && (
                        <p className="text-xs text-orange-700">
                          {cama.observaciones}
                        </p>
                      )}
                    </div>
                  </div>
                </DialogTrigger>
                
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Gestión de Cama {cama.numero}</DialogTitle>
                    <DialogDescription>
                      Sector: {cama.sector}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Panel izquierdo: Gestión de cama */}
                    <div>
                      <BedManagement 
                        bed={cama} 
                        userRole={userRole}
                        onClose={() => setSelectedBed(null)}
                      />
                    </div>
                    
                    {/* Panel derecho: Recomendaciones de IA (solo para camas libres) */}
                    {cama.estado === 'libre' && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <Brain className="h-5 w-5 text-blue-600" />
                          <h3 className="text-lg font-semibold">Recomendaciones de IA</h3>
                        </div>
                        
                        {(() => {
                          const recommendations = generateRecommendationsForBed(cama);
                          
                          return recommendations.length > 0 ? (
                            <div className="space-y-4">
                              {recommendations.map((recommendation, index) => {
                                const paciente = pacientesEspera.find(p => p.id === recommendation.pacienteId);
                                
                                return (
                                  <div
                                    key={index}
                                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                                  >
                                    <div className="flex items-start justify-between mb-3">
                                      <div>
                                        <h4 className="font-medium text-base">
                                          {paciente?.nombre} {paciente?.apellido}
                                        </h4>
                                        <p className="text-sm text-gray-600">
                                          DNI: {paciente?.dni} | {paciente?.obraSocial}
                                        </p>
                                        <p className="text-sm text-gray-700 mt-1">
                                          {paciente?.razonIngreso}
                                        </p>
                                      </div>
                                      <Badge className={`${getScoreColor(recommendation.score)} px-2 py-1 text-xs`}>
                                        {recommendation.score}%
                                      </Badge>
                                    </div>
                                    
                                    <div className="mb-3">
                                      <p className="text-sm text-gray-700 mb-2">
                                        <strong>Análisis:</strong> {recommendation.razon}
                                      </p>
                                      
                                      <div className="text-xs text-gray-600">
                                        <strong>Factores:</strong>
                                        <ul className="mt-1 space-y-1">
                                          {recommendation.factores.map((factor, factorIndex) => (
                                            <li key={factorIndex} className="flex items-center gap-2">
                                              <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                                              {factor}
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    </div>
                                    
                                    <Button 
                                      onClick={() => handleAsignarPaciente(recommendation)}
                                      className="w-full flex items-center gap-2"
                                      size="sm"
                                    >
                                      <Target className="h-4 w-4" />
                                      Asignar Paciente
                                    </Button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <Brain className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">No hay pacientes en espera</p>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BedGrid;
