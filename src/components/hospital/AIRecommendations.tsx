
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress2 } from '@/components/ui/progress2';
import { Brain, TrendingUp, Users, Target, RefreshCw } from 'lucide-react';
import { AIRecommendation, Patient, Bed } from '@/types/hospital';
import { useToast } from '@/hooks/use-toast';

const AIRecommendations = () => {
  const { toast } = useToast();
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Datos de ejemplo para la simulación
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
    }
  ];

  const camasDisponibles: Bed[] = [
    {
      id: '3',
      numero: 'TI-003',
      sector: 'Terapia Intensiva',
      estado: 'libre'
    },
    {
      id: '5',
      numero: 'CM-002',
      sector: 'Clínica Médica',
      estado: 'libre'
    }
  ];

  const generateRecommendations = () => {
    setIsLoading(true);
    
    // Simular procesamiento de IA
    setTimeout(() => {
      const newRecommendations: AIRecommendation[] = [
        {
          pacienteId: '1',
          camaId: '3',
          score: 95,
          razon: 'Paciente con dolor abdominal severo requiere monitoreo intensivo',
          factores: [
            'Prioridad alta del paciente',
            'Sector Terapia Intensiva apropiado para el caso',
            'Disponibilidad inmediata de la cama',
            'Cercanía a estación de enfermería'
          ]
        },
        {
          pacienteId: '2',
          camaId: '5',
          razon: 'Control post-operatorio estándar en clínica médica',
          score: 88,
          factores: [
            'Caso de complejidad media',
            'Sector adecuado para post-operatorio',
            'Cama disponible en zona tranquila',
            'Obra social compatible con sector'
          ]
        }
      ];
      
      setRecommendations(newRecommendations);
      setIsLoading(false);
      
      toast({
        title: "Recomendaciones actualizadas",
        description: `Se generaron ${newRecommendations.length} nuevas recomendaciones de IA.`,
      });
    }, 2000);
  };

  useEffect(() => {
    generateRecommendations();
  }, []);

  const handleAsignarRecomendacion = (recommendation: AIRecommendation) => {
    const paciente = pacientesEspera.find(p => p.id === recommendation.pacienteId);
    const cama = camasDisponibles.find(c => c.id === recommendation.camaId);
    
    toast({
      title: "Asignación confirmada",
      description: `${paciente?.nombre} ${paciente?.apellido} asignado a cama ${cama?.numero}.`,
    });
    
    // Remover la recomendación de la lista
    setRecommendations(recommendations.filter(r => r !== recommendation));
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-blue-600" />
              <div>
                <CardTitle className="text-2xl">Recomendaciones de IA</CardTitle>
                <CardDescription>
                  Sistema inteligente de asignación de camas basado en múltiples factores
                </CardDescription>
              </div>
            </div>
            <Button 
              onClick={generateRecommendations}
              disabled={isLoading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Procesando...' : 'Actualizar'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Estadísticas de IA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Precisión del Sistema</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.2%</div>
            <Progress2 value={94.2} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Últimas 100 asignaciones
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Ahorrado</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">18min</div>
            <p className="text-xs text-muted-foreground">
              Promedio por asignación
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Factores Analizados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Criterios de evaluación
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Activas</CardTitle>
          <CardDescription>
            Asignaciones sugeridas por el sistema de IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Analizando factores y generando recomendaciones...</p>
              </div>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No hay recomendaciones pendientes</p>
              <p className="text-sm text-gray-400 mt-1">
                El sistema está monitoreando continuamente
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recommendations.map((recommendation, index) => {
                const paciente = pacientesEspera.find(p => p.id === recommendation.pacienteId);
                const cama = camasDisponibles.find(c => c.id === recommendation.camaId);
                
                return (
                  <div
                    key={index}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {paciente?.nombre} {paciente?.apellido} → Cama {cama?.numero}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Sector: {cama?.sector}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={`${getScoreColor(recommendation.score)} px-3 py-1`}>
                          {recommendation.score}% compatibilidad
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Análisis de la IA:</h4>
                      <p className="text-sm text-gray-700 mb-3">
                        {recommendation.razon}
                      </p>
                      
                      <h4 className="font-medium mb-2">Factores considerados:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recommendation.factores.map((factor, factorIndex) => (
                          <li key={factorIndex} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex gap-3">
                      <Button 
                        onClick={() => handleAsignarRecomendacion(recommendation)}
                        className="flex items-center gap-2"
                      >
                        <Target className="h-4 w-4" />
                        Confirmar Asignación
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setRecommendations(recommendations.filter(r => r !== recommendation));
                          toast({
                            title: "Recomendación descartada",
                            description: "La recomendación ha sido removida de la lista.",
                          });
                        }}
                      >
                        Descartar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Sobre el Sistema de IA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Factores que Analiza:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Prioridad médica del paciente</li>
                <li>• Tipo de patología y sector requerido</li>
                <li>• Disponibilidad de camas por sector</li>
                <li>• Compatibilidad con obra social</li>
                <li>• Proximidad a áreas críticas</li>
                <li>• Historial de estancia promedio</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Algoritmo de Puntuación:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 90-100%: Asignación óptima</li>
                <li>• 80-89%: Muy buena opción</li>
                <li>• 70-79%: Opción aceptable</li>
                <li>• &lt;70%: Requiere revisión manual</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIRecommendations;
