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

type BooleanOption = 'si' | 'no';

interface ExtendedPatient extends Patient {
  edad: number | '';
  genero: 'masculino' | 'femenino' | 'otro' | '';
  inmunocomprometido: BooleanOption;
  oncológico: BooleanOption;
  leucemia: BooleanOption;
  internadoUltimos30Dias: BooleanOption;
  pacienteGrave: BooleanOption;
  pacienteFinVida: BooleanOption;
  gravedad: BooleanOption; // Reemplaza prioridad con gravedad (Sí/No)
  fechaIngreso: string; // ISO string con fecha y hora
}

const PatientQueue = () => {
  const { toast } = useToast();
  const [pacientesEspera, setPacientesEspera] = useState<ExtendedPatient[]>([
    {
      id: '1',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      dni: '20123456',
      obraSocial: 'PAMI',
      razonIngreso: 'Dolor abdominal severo',
      estado: 'esperando',
      gravedad: 'si',
      edad: 45,
      genero: 'masculino',
      inmunocomprometido: 'no',
      oncológico: 'no',
      leucemia: 'no',
      internadoUltimos30Dias: 'no',
      pacienteGrave: 'si',
      pacienteFinVida: 'no',
      fechaIngreso: new Date().toISOString(),
    },
    {
      id: '2',
      nombre: 'Ana',
      apellido: 'López',
      dni: '25987654',
      obraSocial: 'Galeno',
      razonIngreso: 'Control post-operatorio',
      estado: 'esperando',
      gravedad: 'no',
      edad: 30,
      genero: 'femenino',
      inmunocomprometido: 'no',
      oncológico: 'no',
      leucemia: 'no',
      internadoUltimos30Dias: 'no',
      pacienteGrave: 'no',
      pacienteFinVida: 'no',
      fechaIngreso: new Date().toISOString(),
    },
    {
      id: '3',
      nombre: 'Roberto',
      apellido: 'Martínez',
      dni: '18567890',
      obraSocial: 'Medicus',
      razonIngreso: 'Insuficiencia respiratoria',
      estado: 'esperando',
      gravedad: 'si',
      edad: 60,
      genero: 'masculino',
      inmunocomprometido: 'si',
      oncológico: 'si',
      leucemia: 'no',
      internadoUltimos30Dias: 'si',
      pacienteGrave: 'si',
      pacienteFinVida: 'no',
      fechaIngreso: new Date().toISOString(),
    }
  ]);

  // Estado para manejo del formulario
  const [paso, setPaso] = useState(1);

  const [nuevoPaciente, setNuevoPaciente] = useState<Partial<ExtendedPatient>>({
    nombre: '',
    apellido: '',
    dni: '',
    obraSocial: '',
    razonIngreso: '',
    gravedad: 'no',
    edad: '',
    genero: '',
    inmunocomprometido: 'no',
    oncológico: 'no',
    leucemia: 'no',
    internadoUltimos30Dias: 'no',
    pacienteGrave: 'no',
    pacienteFinVida: 'no',
    fechaIngreso: new Date().toISOString(),
  });

  const handleSiguiente = () => {
    if (!nuevoPaciente.nombre || !nuevoPaciente.apellido || !nuevoPaciente.dni) {
      toast({
        title: "Error",
        description: "Por favor completa Nombre, Apellido y DNI para continuar.",
        variant: "destructive"
      });
      return;
    }
    setPaso(2);
  };

  const handleAgregarPaciente = () => {
    // Podrías agregar más validaciones aquí
    const paciente: ExtendedPatient = {
      id: Date.now().toString(),
      nombre: nuevoPaciente.nombre!,
      apellido: nuevoPaciente.apellido!,
      dni: nuevoPaciente.dni!,
      obraSocial: nuevoPaciente.obraSocial || 'Sin obra social',
      razonIngreso: nuevoPaciente.razonIngreso || 'No especificada',
      estado: 'esperando',
      gravedad: nuevoPaciente.gravedad || 'no',
      edad: typeof nuevoPaciente.edad === 'number' ? nuevoPaciente.edad : Number(nuevoPaciente.edad),
      genero: nuevoPaciente.genero || '',
      inmunocomprometido: nuevoPaciente.inmunocomprometido || 'no',
      oncológico: nuevoPaciente.oncológico || 'no',
      leucemia: nuevoPaciente.leucemia || 'no',
      internadoUltimos30Dias: nuevoPaciente.internadoUltimos30Dias || 'no',
      pacienteGrave: nuevoPaciente.pacienteGrave || 'no',
      pacienteFinVida: nuevoPaciente.pacienteFinVida || 'no',
      fechaIngreso: nuevoPaciente.fechaIngreso || new Date().toISOString(),
    };

    setPacientesEspera([...pacientesEspera, paciente]);
    setNuevoPaciente({
      nombre: '',
      apellido: '',
      dni: '',
      obraSocial: '',
      razonIngreso: '',
      gravedad: 'no',
      edad: '',
      genero: '',
      inmunocomprometido: 'no',
      oncológico: 'no',
      leucemia: 'no',
      internadoUltimos30Dias: 'no',
      pacienteGrave: 'no',
      pacienteFinVida: 'no',
      fechaIngreso: new Date().toISOString(),
    });
    setPaso(1);

    toast({
      title: "Paciente agregado",
      description: `${paciente.nombre} ${paciente.apellido} ha sido agregado a la cola de espera.`,
    });
  };

  const getGravedadColor = (gravedad: BooleanOption) => {
    return gravedad === 'si' ? 'bg-red-600 text-white' : 'bg-green-500 text-white';
  };

  // Ordenar pacientes por gravedad (si primero)
  const pacientesOrdenados = [...pacientesEspera].sort((a, b) => {
    const gravedadOrder = { 'si': 2, 'no': 1 };
    return gravedadOrder[b.gravedad] - gravedadOrder[a.gravedad];
  });

  return (
    <div className="space-y-6">
      {/* Estadísticas, igual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cola</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pacientesEspera.length}</div>
            <p className="text-xs text-muted-foreground">Pacientes esperando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gravedad Sí</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {pacientesEspera.filter(p => p.gravedad === 'si').length}
            </div>
            <p className="text-xs text-muted-foreground">Pacientes con gravedad alta</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45min</div>
            <p className="text-xs text-muted-foreground">Espera estimada</p>
          </CardContent>
        </Card>
      </div>

      {/* Agregar Nuevo Paciente en 2 pasos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cola de Pacientes</CardTitle>
              <CardDescription>Gestión de pacientes en espera de internación</CardDescription>
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
                  <DialogTitle>Agregar Paciente - Paso {paso} de 2</DialogTitle>
                  <DialogDescription>
                    {paso === 1
                      ? "Completa los datos personales y motivo de ingreso"
                      : "Completa los datos clínicos y fecha de ingreso"}
                  </DialogDescription>
                </DialogHeader>

                {paso === 1 && (
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="nombre">Nombre</Label>
                      <Input
                        id="nombre"
                        value={nuevoPaciente.nombre}
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, nombre: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="apellido">Apellido</Label>
                      <Input
                        id="apellido"
                        value={nuevoPaciente.apellido}
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, apellido: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dni">DNI</Label>
                      <Input
                        id="dni"
                        value={nuevoPaciente.dni}
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, dni: e.target.value })}
                        required
                        type="number"
                        min={0}
                      />
                    </div>
                    <div>
                      <Label htmlFor="razonIngreso">Razón de ingreso</Label>
                      <Textarea
                        id="razonIngreso"
                        value={nuevoPaciente.razonIngreso}
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, razonIngreso: e.target.value })}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="obraSocial">Obra social</Label>
                      <Input
                        id="obraSocial"
                        value={nuevoPaciente.obraSocial}
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, obraSocial: e.target.value })}
                      />
                    </div>
                    <Button type="button" onClick={handleSiguiente} className="mt-4 w-full">
                      Siguiente
                    </Button>
                  </form>
                )}

                {paso === 2 && (
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edad">Edad</Label>
                      <Input
                        id="edad"
                        type="number"
                        value={nuevoPaciente.edad}
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, edad: Number(e.target.value) })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="genero">Género</Label>
                      <Select
                        value={nuevoPaciente.genero}
                        onValueChange={(value) => setNuevoPaciente({ ...nuevoPaciente, genero: value as any })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="femenino">Femenino</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Inmunocomprometido</Label>
                      <Select
                        value={nuevoPaciente.inmunocomprometido}
                        onValueChange={(value) => setNuevoPaciente({ ...nuevoPaciente, inmunocomprometido: value as BooleanOption })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Oncológico</Label>
                      <Select
                        value={nuevoPaciente.oncológico}
                        onValueChange={(value) => setNuevoPaciente({ ...nuevoPaciente, oncológico: value as BooleanOption })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Leucemia</Label>
                      <Select
                        value={nuevoPaciente.leucemia}
                        onValueChange={(value) => setNuevoPaciente({ ...nuevoPaciente, leucemia: value as BooleanOption })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Internado últimos 30 días</Label>
                      <Select
                        value={nuevoPaciente.internadoUltimos30Dias}
                        onValueChange={(value) => setNuevoPaciente({ ...nuevoPaciente, internadoUltimos30Dias: value as BooleanOption })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Paciente grave</Label>
                      <Select
                        value={nuevoPaciente.pacienteGrave}
                        onValueChange={(value) => setNuevoPaciente({ ...nuevoPaciente, pacienteGrave: value as BooleanOption })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Fin de vida</Label>
                      <Select
                        value={nuevoPaciente.pacienteFinVida}
                        onValueChange={(value) => setNuevoPaciente({ ...nuevoPaciente, pacienteFinVida: value as BooleanOption })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Gravedad</Label>
                      <Select
                        value={nuevoPaciente.gravedad}
                        onValueChange={(value) => setNuevoPaciente({ ...nuevoPaciente, gravedad: value as BooleanOption })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="si">Sí</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="fechaIngreso">Fecha de ingreso</Label>
                      <Input
                        id="fechaIngreso"
                        type="datetime-local"
                        value={nuevoPaciente.fechaIngreso?.slice(0, 16) || ''}
                        onChange={(e) => setNuevoPaciente({ ...nuevoPaciente, fechaIngreso: e.target.value })}
                      />
                    </div>

                    <div className="md:col-span-2 flex justify-between mt-4">
                      <Button variant="outline" onClick={() => setPaso(1)}>
                        Volver
                      </Button>
                      <Button type="button" onClick={handleAgregarPaciente}>
                        Agregar a la cola
                      </Button>
                    </div>
                  </form>
                )}


              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {pacientesOrdenados.map((paciente) => (
            <div key={paciente.id} className="flex items-center justify-between border rounded p-3">
              <div>
                <div className="font-bold">{paciente.nombre} {paciente.apellido}</div>
                <div className="text-sm text-muted-foreground">{paciente.razonIngreso}</div>
                <div className="text-xs text-muted-foreground">DNI: {paciente.dni} - OS: {paciente.obraSocial}</div>
              </div>
              <Badge className={getGravedadColor(paciente.gravedad)}>
                {paciente.gravedad === 'si' ? 'Crítico' : 'No Crítico'}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientQueue;