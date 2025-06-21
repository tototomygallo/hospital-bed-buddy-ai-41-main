import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import {
  Users, Bed, Clock, TrendingUp, Hospital
} from 'lucide-react';
import { Sector } from '@/types/hospital';
import BedGrid from './BedGrid';
import PatientQueue from './PatientQueue';
import AIRecommendations from './AIRecommendations';
import { useNavigate } from 'react-router-dom';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const HospitalDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const [sectores] = useState<Sector[]>([
    {
      id: '1',
      nombre: 'Terapia Intensiva',
      camasTotal: 12,
      camasOcupadas: 8,
      camasDisponibles: 2,
      camasEnLimpieza: 2,
      color: 'bg-red-500'
    },
    {
      id: '2',
      nombre: 'Clínica Médica',
      camasTotal: 24,
      camasOcupadas: 15,
      camasDisponibles: 6,
      camasEnLimpieza: 3,
      color: 'bg-blue-500'
    },
    {
      id: '3',
      nombre: 'Cirugía',
      camasTotal: 18,
      camasOcupadas: 12,
      camasDisponibles: 4,
      camasEnLimpieza: 2,
      color: 'bg-green-500'
    },
    {
      id: '4',
      nombre: 'Pediatría',
      camasTotal: 16,
      camasOcupadas: 9,
      camasDisponibles: 5,
      camasEnLimpieza: 2,
      color: 'bg-purple-500'
    }
  ]);

  const [currentUser] = useState({
    nombre: 'Dr. García',
    rol: 'administracion' as const
  });

  const totalCamas = 106;
  const totalOcupadas = 70;
  const ocupacionGeneral = Math.round((totalOcupadas / totalCamas) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Hospital className="text-blue-600" />
              CEMIC - Las Heras
            </h1>
            <p className="text-gray-600 mt-1">Bienvenido, {currentUser.nombre}</p>
          </div>

          {currentUser.rol === 'administracion' && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                  Administración
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-black">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ocupación General</CardTitle>
              <TrendingUp className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{ocupacionGeneral}%</div>
              <Progress value={ocupacionGeneral} className="mt-2 bg-gray-100" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Camas</CardTitle>
              <Bed className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCamas}</div>
              <p className="text-xs text-muted-foreground">
                {totalOcupadas} ocupadas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pacientes Esperando</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                2 críticos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24min</div>
              <p className="text-xs text-muted-foreground">
                Asignación de cama
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sectores Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Estado de Sectores</CardTitle>
            <CardDescription>
              Vista general de la ocupación por sector
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {sectores.map((sector) => {
                const ocupacion = Math.round((sector.camasOcupadas / sector.camasTotal) * 100);
                return (
                  <div key={sector.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{sector.nombre}</h3>
                      <div className={`w-3 h-3 rounded-full ${sector.color}`}></div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Ocupación:</span>
                        <span className="font-medium">{ocupacion}%</span>
                      </div>
                      <Progress value={ocupacion} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>{sector.camasOcupadas} ocupadas</span>
                        <span>{sector.camasDisponibles} libres</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="camas" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="camas">Gestión de Camas</TabsTrigger>
            <TabsTrigger value="pacientes">Cola de Pacientes</TabsTrigger>
            <TabsTrigger value="ia">Recomendaciones IA</TabsTrigger>
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
          </TabsList>

          <TabsContent value="camas">
            <BedGrid sectores={sectores} userRole={currentUser.rol} />
          </TabsContent>

          <TabsContent value="pacientes">
            <PatientQueue />
          </TabsContent>

          <TabsContent value="ia">
            <AIRecommendations />
          </TabsContent>

          <TabsContent value="reportes">
            <Card>
              <CardHeader>
                <CardTitle>Reportes y Estadísticas</CardTitle>
                <CardDescription>
                  Análisis detallado del funcionamiento hospitalario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  Módulo de reportes en desarrollo...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HospitalDashboard;
