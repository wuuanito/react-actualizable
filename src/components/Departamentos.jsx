import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  Chip
} from '@mui/material';
import {
  Business as BusinessIcon,
  ShoppingCart as ShoppingCartIcon,
  VerifiedUser as QualityIcon,
  Science as LabIcon,
  Engineering as TechIcon,
  AccountBalance as ManagementIcon,
  People as HRIcon,
  Build as MaintenanceIcon,
  Computer as ITIcon,
  Factory as ProductionIcon,
  Medication as SoftgelIcon,
  LocalShipping as LogisticsIcon
} from '@mui/icons-material';

const Departamentos = () => {
  const departamentos = [
    {
      id: 'administracion',
      nombre: 'Administración',
      descripcion: 'Gestión administrativa y financiera',
      icon: <BusinessIcon />,
      color: '#1976d2',
      empleados: 8
    },
    {
      id: 'compras',
      nombre: 'Compras',
      descripcion: 'Adquisiciones y proveedores',
      icon: <ShoppingCartIcon />,
      color: '#388e3c',
      empleados: 5
    },
    {
      id: 'calidad',
      nombre: 'Calidad',
      descripcion: 'Control y aseguramiento de calidad',
      icon: <QualityIcon />,
      color: '#f57c00',
      empleados: 12
    },
    {
      id: 'laboratorio',
      nombre: 'Laboratorio',
      descripcion: 'Análisis y desarrollo',
      icon: <LabIcon />,
      color: '#7b1fa2',
      empleados: 15
    },
    {
      id: 'oficina-tecnica',
      nombre: 'Oficina Técnica',
      descripcion: 'Diseño y especificaciones técnicas',
      icon: <TechIcon />,
      color: '#455a64',
      empleados: 10
    },
    {
      id: 'gerencia',
      nombre: 'Gerencia',
      descripcion: 'Dirección y estrategia empresarial',
      icon: <ManagementIcon />,
      color: '#c62828',
      empleados: 3
    },
    {
      id: 'rrhh',
      nombre: 'Recursos Humanos',
      descripcion: 'Gestión del talento humano',
      icon: <HRIcon />,
      color: '#00796b',
      empleados: 6
    },
    {
      id: 'mantenimiento',
      nombre: 'Mantenimiento',
      descripcion: 'Mantenimiento de equipos e instalaciones',
      icon: <MaintenanceIcon />,
      color: '#5d4037',
      empleados: 18
    },
    {
      id: 'informatica',
      nombre: 'Informática',
      descripcion: 'Sistemas y tecnología',
      icon: <ITIcon />,
      color: '#303f9f',
      empleados: 4
    },
    {
      id: 'produccion',
      nombre: 'Producción',
      descripcion: 'Manufactura y procesos productivos',
      icon: <ProductionIcon />,
      color: '#d32f2f',
      empleados: 45
    },
    {
      id: 'softgel',
      nombre: 'Softgel',
      descripcion: 'Producción de cápsulas blandas',
      icon: <SoftgelIcon />,
      color: '#1976d2',
      empleados: 25
    },
    {
      id: 'logistica',
      nombre: 'Logística',
      descripcion: 'Distribución y almacenamiento',
      icon: <LogisticsIcon />,
      color: '#689f38',
      empleados: 12
    }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
        Departamentos
      </Typography>
      
      <Grid container spacing={3}>
        {departamentos.map((dept) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={dept.id}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4
                },
                cursor: 'pointer'
              }}
            >
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Avatar
                  sx={{
                    bgcolor: dept.color,
                    width: 56,
                    height: 56,
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  {dept.icon}
                </Avatar>
                
                <Typography variant="h6" component="h2" gutterBottom>
                  {dept.nombre}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2, minHeight: '40px' }}
                >
                  {dept.descripcion}
                </Typography>
                
                <Chip
                  label={`${dept.empleados} empleados`}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: dept.color,
                    color: dept.color
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Departamentos;