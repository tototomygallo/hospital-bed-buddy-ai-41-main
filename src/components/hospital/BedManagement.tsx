
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { UserCheck, UserX, Sparkles, ClipboardCheck } from 'lucide-react';
import { Bed as BedType } from '@/types/hospital';
import { useToast } from '@/hooks/use-toast';

interface BedManagementProps {
  bed: BedType;
  userRole: 'doctor' | 'administracion' | 'limpieza' | 'supervisor';
  onClose: () => void;
}

const BedManagement: React.FC<BedManagementProps> = ({ bed, userRole, onClose }) => {
  const { toast } = useToast();
  const [observaciones, setObservaciones] = useState(bed.observaciones || '');

  const canDarAlta = userRole === 'doctor' || userRole === 'supervisor';
  const canMarcarLimpia = userRole === 'limpieza' || userRole === 'supervisor';
  const canAsignarCama = userRole === 'administracion' || userRole === 'supervisor';

  const handleDarAlta = () => {
    toast({
      title: "Alta médica registrada",
      description: `El paciente ${bed.paciente?.nombre} ${bed.paciente?.apellido} ha sido dado de alta.`,
    });
    // Aquí iría la lógica para dar de alta
    console.log('Dar de alta al paciente:', bed.paciente);
  };

  const handleMarcarLimpia = () => {
    toast({
      title: "Limpieza completada",
      description: `La cama ${bed.numero} ha sido marcada como limpia y disponible.`,
    });
    // Aquí iría la lógica para marcar como limpia
    console.log('Marcar cama como limpia:', bed.id);
  };

  const handleMantenimiento = () => {
    toast({
      title: "Mantenimiento programado",
      description: `La cama ${bed.numero} ha sido programada para mantenimiento.`,
    });
    // Aquí iría la lógica para programar mantenimiento
    console.log('Programar mantenimiento:', bed.id);
  };

  return (
    <div className="space-y-6">
      {/* Información de la Cama */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Cama {bed.numero}</CardTitle>
              <CardDescription>Sector: {bed.sector}</CardDescription>
            </div>
            <Badge variant={bed.estado === 'libre' ? 'default' : 'secondary'}>
              {bed.estado.charAt(0).toUpperCase() + bed.estado.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {bed.paciente && (
            <div className="space-y-3">
              <h4 className="font-semibold">Paciente Actual:</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Nombre Completo</Label>
                    <p>{bed.paciente.nombre} {bed.paciente.apellido}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">DNI</Label>
                    <p>{bed.paciente.dni}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Obra Social</Label>
                    <p>{bed.paciente.obraSocial}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Prioridad</Label>
                    <Badge 
                      className="ml-2" 
                      variant={bed.paciente.prioridad === 'alta' ? 'destructive' : 'default'}
                    >
                      {bed.paciente.prioridad}
                    </Badge>
                  </div>
                </div>
                <div className="mt-3">
                  <Label className="text-sm font-medium">Razón de Ingreso</Label>
                  <p className="text-sm text-gray-700">{bed.paciente.razonIngreso}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Observaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Observaciones</CardTitle>
          <CardDescription>
            Notas adicionales sobre el estado de la cama
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            placeholder="Agregar observaciones..."
            rows={3}
          />
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={() => {
              toast({
                title: "Observaciones guardadas",
                description: "Las observaciones han sido actualizadas correctamente.",
              });
            }}
          >
            Guardar Observaciones
          </Button>
        </CardContent>
      </Card>

      {/* Acciones según Rol */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Disponibles</CardTitle>
          <CardDescription>
            Según tu rol: {userRole}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Alta Médica */}
            {bed.paciente && canDarAlta && (
              <Button
                onClick={handleDarAlta}
                variant="default"
                className="flex items-center gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Dar de Alta
              </Button>
            )}

            {/* Marcar como Limpia */}
            {bed.estado === 'limpieza' && canMarcarLimpia && (
              <Button
                onClick={handleMarcarLimpia}
                variant="default"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Sparkles className="h-4 w-4" />
                Marcar como Limpia
              </Button>
            )}

            {/* Programar Mantenimiento */}
            {(userRole === 'supervisor' || userRole === 'administracion') && (
              <Button
                onClick={handleMantenimiento}
                variant="outline"
                className="h-10 px-1 min-w-[175px] text-sm px-1 py-1.5 gap-2"
              >
            
                <ClipboardCheck className="h-4 w-4" />
                <span className="text-xs">Programar Mantenimiento</span>
              </Button>
            )}

            {/* Asignar Paciente */}
            {bed.estado === 'libre' && canAsignarCama && (
              <Button
                variant="default"
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-500 text-sm px-5 py-1.5"
                onClick={() => {
                  toast({
                    title: "Función en desarrollo",
                    description: "La asignación de pacientes se implementará en el módulo de cola.",
                  });
                }}
              >
                <UserCheck className="h-4 w-4" />
                <span className="text-xs">Asignar Paciente</span>
              </Button>
            )}
          </div>

          {/* Información de Permisos */}
          <Separator className="my-4" />
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">Permisos de tu rol:</p>
            <ul className="space-y-1">
              {canDarAlta && <li>• Dar de alta pacientes</li>}
              {canMarcarLimpia && <li>• Marcar camas como limpias</li>}
              {canAsignarCama && <li>• Asignar pacientes a camas</li>}
              {userRole === 'supervisor' && <li>• Acceso completo a todas las funciones</li>}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BedManagement;
