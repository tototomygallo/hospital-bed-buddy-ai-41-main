
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, Clock, AlertTriangle, Users } from 'lucide-react';
import { Patient } from '@/types/hospital';
import { useToast } from '@/hooks/use-toast';

const PatientQueue = () => {
  const { toast } = useToast();
  const [pacientesEspera, setPacientesEspera] = useState<Patient[]>([
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
      dni: '18567890',
      obraSocial: 'Medicus',
      razonIngreso: 'Insuficiencia respiratoria',
      estado: 'esperando',
      prioridad: 'critica'
    }
  ]);

  const [nuevoPackiente, setNuevoPaciente] = useState<Partial<Patient>>({
    nombre: '',
    apellido: '',
    dni: '',
    obraSocial: '',
    razonIngreso: '',
    prioridad: 'media'
  });

  const handleAgregarPaciente = () => {
    if (!nuevoPackiente.nombre || !nuevoPackiente.apellido || !nuevoPackiente.dni) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios.",
        variant: "destructive"
      });
      return;
    }

    const paciente: Patient = {
      id: Date.now().toString(),
      nombre: nuevoPackiente.nombre!,
      apellido: nuevoPackiente.apellido!,
      dni: nuevoPackiente.dni!,
      obraSocial: nuevoPackiente.obraSocial || 'Sin obra social',
      razonIngreso: nuevoPackiente.razonIngreso || 'No especificada',
      estado: 'esperando',
      prioridad: nuevoPackiente.prioridad as Patient['prioridad'] || 'media'
    };

    setPacientesEspera([...pacientesEspera, paciente]);
    setNuevoPaciente({
      nombre: '',
      apellido: '',
      dni: '',
      obraSocial: '',
      razonIngreso: '',
      prioridad: 'media'
    });

    toast({
      title: "Paciente agregado",
      description: `${paciente.nombre} ${paciente.apellido} ha sido agregado a la cola de espera.`,
    });
  };

  const getPriorityColor = (prioridad: Patient['prioridad']) => {
    switch (prioridad) {
      case 'critica':
        return 'bg-red-600 text-white';
      case 'alta':
        return 'bg-orange-500 text-white';
      case 'media':
        return 'bg-yellow-500 text-white';
      case 'baja':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getPriorityIcon = (prioridad: Patient['prioridad']) => {
    if (prioridad === 'critica' || prioridad === 'alta') {
      return <AlertTriangle className="h-4 w-4" />;
    }
    return <Clock className="h-4 w-4" />;
  };

  // Ordenar pacientes por prioridad
  const pacientesOrdenados = [...pacientesEspera].sort((a, b) => {
    const prioridadOrder = { 'critica': 4, 'alta': 3, 'media': 2, 'baja': 1 };
    return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
  });

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cola</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pacientesEspera.length}</div>
            <p className="text-xs text-muted-foreground">
              Pacientes esperando
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Críticos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pacientesEspera.filter(p => p.prioridad === 'critica').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención inmediata
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45min</div>
            <p className="text-xs text-muted-foreground">
              Espera estimada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Agregar Nuevo Paciente */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cola de Pacientes</CardTitle>
              <CardDescription>
                Gestión de pacientes en espera de internación
              </CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Agregar Paciente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Nuevo Paciente</DialogTitle>
                  <DialogDescription>
                    Completa los datos del paciente para agregarlo a la cola
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input
                        id="nombre"
                        value={nuevoPackiente.nombre || ''}
                        onChange={(e) => setNuevoPaciente({...nuevoPackiente, nombre: e.target.value})}
                        placeholder="Nombre"
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido *</Label>
                      <Input
                        id="apellido"
                        value={nuevoPackiente.apellido || ''}
                        onChange={(e) => setNuevoPaciente({...nuevoPackiente, apellido: e.target.value})}
                        placeholder="Apellido"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="dni">DNI *</Label>
                    <Input
                      id="dni"
                      value={nuevoPackiente.dni || ''}
                      onChange={(e) => setNuevoPaciente({...nuevoPackiente, dni: e.target.value})}
                      placeholder="12345678"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="obraSocial">Obra Social</Label>
                    <Input
                      id="obraSocial"
                      value={nuevoPackiente.obraSocial || ''}
                      onChange={(e) => setNuevoPaciente({...nuevoPackiente, obraSocial: e.target.value})}
                      placeholder="OSDE, Swiss Medical, etc."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="prioridad">Prioridad</Label>
                    <Select 
                      value={nuevoPackiente.prioridad || 'media'} 
                      onValueChange={(value) => setNuevoPaciente({...nuevoPackiente, prioridad: value as Patient['prioridad']})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baja">Baja</SelectItem>
                        <SelectItem value="media">Media</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                        <SelectItem value="critica">Crítica</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="razonIngreso">Razón de Ingreso</Label>
                    <Textarea
                      id="razonIngreso"
                      value={nuevoPackiente.razonIngreso || ''}
                      onChange={(e) => setNuevoPaciente({...nuevoPackiente, razonIngreso: e.target.value})}
                      placeholder="Describe el motivo de internación..."
                      rows={3}
                    />
                  </div>
                  
                  <Button onClick={handleAgregarPaciente} className="w-full">
                    Agregar a la Cola
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pacientesOrdenados.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No hay pacientes en cola
              </div>
            ) : (
              pacientesOrdenados.map((paciente, index) => (
                <div
                  key={paciente.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-semibold">
                        {paciente.nombre} {paciente.apellido}
                      </h4>
                      <p className="text-sm text-gray-600">DNI: {paciente.dni}</p>
                      <p className="text-sm text-gray-600">{paciente.obraSocial}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className={`${getPriorityColor(paciente.prioridad)} flex items-center gap-1 mb-2`}>
                      {getPriorityIcon(paciente.prioridad)}
                      {paciente.prioridad.charAt(0).toUpperCase() + paciente.prioridad.slice(1)}
                    </Badge>
                    <p className="text-sm text-gray-600 max-w-xs">
                      {paciente.razonIngreso}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientQueue;
