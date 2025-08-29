import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  InputBase,
  Box,
  IconButton,
  alpha,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  ListItemText,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  Collapse,
  useMediaQuery,
  useTheme as useMuiTheme
} from '@mui/material';
import {
  Search as SearchIcon,
  Menu as MenuIcon,
  AccountCircle,
  Notifications as NotificationsIcon,
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Home as HomeIcon,
  Business as BusinessIcon,
  DataUsage as DataUsageIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
  Close as CloseIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

// Styled components para el campo de búsqueda
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const Navbar = ({ currentSection = 'inicio', onSectionChange }) => {
  const [searchValue, setSearchValue] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [departmentAnchorEl, setDepartmentAnchorEl] = useState(null);
  const [capturaAnchorEl, setCapturaAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [departmentMobileOpen, setDepartmentMobileOpen] = useState(false);
  const [capturaMobileOpen, setCapturaMobileOpen] = useState(false);
  const open = Boolean(anchorEl);
  const departmentOpen = Boolean(departmentAnchorEl);
  const capturaOpen = Boolean(capturaAnchorEl);
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDepartmentMenuOpen = (event) => {
    setDepartmentAnchorEl(event.currentTarget);
  };

  const handleDepartmentMenuClose = () => {
    setDepartmentAnchorEl(null);
  };

  const handleCapturaMenuOpen = (event) => {
    setCapturaAnchorEl(event.currentTarget);
  };

  const handleCapturaMenuClose = () => {
    setCapturaAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDepartmentMobileToggle = () => {
    setDepartmentMobileOpen(!departmentMobileOpen);
  };

  const handleCapturaMobileToggle = () => {
    setCapturaMobileOpen(!capturaMobileOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileOpen(false);
    setDepartmentMobileOpen(false);
    setCapturaMobileOpen(false);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  const handleSectionClick = (section) => {
    if (onSectionChange) {
      onSectionChange(section);
    }
    console.log('Navegando a:', section);
  };

  const navigationItems = [
    { id: 'inicio', label: 'Inicio', icon: <HomeIcon /> },
    { id: 'departamentos', label: 'Departamentos', icon: <BusinessIcon /> },
    { id: 'captura', label: 'Captura de Datos', icon: <DataUsageIcon /> }
  ];

  const departamentos = [
    { id: 'administracion', nombre: 'Administración', icon: <BusinessIcon />, color: '#1976d2', descripcion: 'Gestión administrativa y financiera' },
    { id: 'compras', nombre: 'Compras', icon: <SearchIcon />, color: '#388e3c', descripcion: 'Adquisiciones y proveedores' },
    { id: 'calidad', nombre: 'Calidad', icon: <NotificationsIcon />, color: '#f57c00', descripcion: 'Control y aseguramiento de calidad' },
    { id: 'laboratorio', nombre: 'Laboratorio', icon: <LightModeIcon />, color: '#7b1fa2', descripcion: 'Análisis y desarrollo' },
    { id: 'oficina-tecnica', nombre: 'Oficina Técnica', icon: <SettingsIcon />, color: '#455a64', descripcion: 'Diseño y especificaciones técnicas' },
    { id: 'gerencia', nombre: 'Gerencia', icon: <AccountCircle />, color: '#c62828', descripcion: 'Dirección y estrategia empresarial' },
    { id: 'rrhh', nombre: 'Recursos Humanos', icon: <PersonIcon />, color: '#00796b', descripcion: 'Gestión del talento humano' },
    { id: 'mantenimiento', nombre: 'Mantenimiento', icon: <SettingsIcon />, color: '#5d4037', descripcion: 'Mantenimiento de equipos e instalaciones' },
    { id: 'informatica', nombre: 'Informática', icon: <DataUsageIcon />, color: '#303f9f', descripcion: 'Sistemas y tecnología' },
    { id: 'logistica', nombre: 'Logística', icon: <HomeIcon />, color: '#689f38', descripcion: 'Distribución y almacenamiento' }
  ];

  const capturaOpciones = [
    { id: 'produccion', nombre: 'Producción', icon: <BusinessIcon />, color: '#d32f2f' },
    { id: 'softgel', nombre: 'Softgel', icon: <LightModeIcon />, color: '#1976d2' }
  ];

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Búsqueda:', searchValue);
    // Aquí puedes agregar la lógica de búsqueda
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ px: { xs: 1, sm: 3 } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ 
             display: { xs: 'none', sm: 'flex' }, 
             mr: 4,
             backgroundColor: 'white',
             borderRadius: '8px',
             padding: '8px 12px',
             alignItems: 'center'
           }}>
             <img 
               src="https://www.riojanaturepharma.com/assets/img/logo-big.png" 
               alt="RNP Logo" 
               style={{ 
                 height: '40px', 
                 width: 'auto',
                 objectFit: 'contain'
               }} 
             />
           </Box>
          
          {/* Menú de navegación */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }}>
            {navigationItems.map((item) => {
              if (item.id === 'departamentos') {
                return (
                  <IconButton
                    key={item.id}
                    color="inherit"
                    onClick={handleDepartmentMenuOpen}
                    sx={{
                      mx: 1,
                      px: 2,
                      borderRadius: 2,
                      backgroundColor: departmentOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: 'auto'
                    }}
                  >
                    {item.icon}
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                      {item.label}
                    </Typography>
                  </IconButton>
                );
              }
              if (item.id === 'captura') {
                return (
                  <IconButton
                    key={item.id}
                    color="inherit"
                    onClick={handleCapturaMenuOpen}
                    sx={{
                      mx: 1,
                      px: 2,
                      borderRadius: 2,
                      backgroundColor: capturaOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      minWidth: 'auto'
                    }}
                  >
                    {item.icon}
                    <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                      {item.label}
                    </Typography>
                  </IconButton>
                );
              }
              return (
                <IconButton
                  key={item.id}
                  color="inherit"
                  onClick={() => handleSectionClick(item.id)}
                  sx={{
                    mx: 1,
                    px: 2,
                    borderRadius: 2,
                    backgroundColor: currentSection === item.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)'
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minWidth: 'auto'
                  }}
                >
                  {item.icon}
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', mt: 0.5 }}>
                    {item.label}
                  </Typography>
                </IconButton>
              );
            })}
            
            {/* Menú desplegable de Departamentos */}
             <Menu
               anchorEl={departmentAnchorEl}
               open={departmentOpen}
               onClose={handleDepartmentMenuClose}
               MenuListProps={{
                 'aria-labelledby': 'departamentos-button',
               }}
               PaperProps={{
                 sx: {
                   maxHeight: 500,
                   width: '380px',
                   borderRadius: 3,
                   boxShadow: (theme) => theme.palette.mode === 'dark' 
                     ? '0 8px 32px rgba(0,0,0,0.4)' 
                     : '0 8px 32px rgba(0,0,0,0.12)',
                   border: (theme) => theme.palette.mode === 'dark'
                     ? '1px solid rgba(255,255,255,0.1)'
                     : '1px solid rgba(0,0,0,0.1)',
                   backdropFilter: 'blur(10px)',
                   backgroundColor: 'background.paper',
                   backgroundImage: (theme) => theme.palette.mode === 'dark'
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                     : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)'
                 }
               }}
               transformOrigin={{ horizontal: 'left', vertical: 'top' }}
               anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
             >
               <Box sx={{ p: 2, borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
                </Box>
               {departamentos.map((dept, index) => (
                 <MenuItem
                   key={dept.id}
                   onClick={() => {
                     console.log('Departamento seleccionado:', dept.nombre);
                     handleDepartmentMenuClose();
                   }}
                   sx={{
                      py: 1.5,
                      px: 3,
                      mx: 1,
                      my: 0.5,
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                          ? `${dept.color}25`
                          : `${dept.color}15`,
                        transform: 'translateX(4px)',
                        boxShadow: (theme) => theme.palette.mode === 'dark'
                          ? `0 4px 12px ${dept.color}40`
                          : `0 4px 12px ${dept.color}25`
                      },
                      '&:last-child': {
                        mb: 1
                      }
                    }}
                 >
                   <ListItemIcon sx={{ minWidth: 40 }}>
                     <Box
                       sx={{
                         width: 32,
                         height: 32,
                         borderRadius: '50%',
                         backgroundColor: dept.color,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         color: 'white',
                         fontSize: '1rem'
                       }}
                     >
                       {dept.icon}
                     </Box>
                   </ListItemIcon>
                   <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {dept.nombre}
                        </Typography>
                      }
                    />
                 </MenuItem>
               ))}
             </Menu>
             
             {/* Menú desplegable de Captura de Datos */}
             <Menu
               anchorEl={capturaAnchorEl}
               open={capturaOpen}
               onClose={handleCapturaMenuClose}
               MenuListProps={{
                 'aria-labelledby': 'captura-button',
               }}
               PaperProps={{
                 sx: {
                   maxHeight: 300,
                   width: '280px',
                   borderRadius: 3,
                   boxShadow: (theme) => theme.palette.mode === 'dark' 
                     ? '0 8px 32px rgba(0,0,0,0.4)' 
                     : '0 8px 32px rgba(0,0,0,0.12)',
                   border: (theme) => theme.palette.mode === 'dark'
                     ? '1px solid rgba(255,255,255,0.1)'
                     : '1px solid rgba(0,0,0,0.1)',
                   backdropFilter: 'blur(10px)',
                   backgroundColor: 'background.paper',
                   backgroundImage: (theme) => theme.palette.mode === 'dark'
                     ? 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                     : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)'
                 }
               }}
               transformOrigin={{ horizontal: 'left', vertical: 'top' }}
               anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
             >
               {capturaOpciones.map((opcion, index) => (
                 <MenuItem
                   key={opcion.id}
                   onClick={() => {
                     console.log('Opción de captura seleccionada:', opcion.nombre);
                     handleCapturaMenuClose();
                   }}
                   sx={{
                      py: 1.5,
                      px: 3,
                      mx: 1,
                      my: 0.5,
                      borderRadius: 2,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                          ? `${opcion.color}25`
                          : `${opcion.color}15`,
                        transform: 'translateX(4px)',
                        boxShadow: (theme) => theme.palette.mode === 'dark'
                          ? `0 4px 12px ${opcion.color}40`
                          : `0 4px 12px ${opcion.color}25`
                      },
                      '&:last-child': {
                        mb: 1
                      }
                    }}
                 >
                   <ListItemIcon sx={{ minWidth: 40 }}>
                     <Box
                       sx={{
                         width: 32,
                         height: 32,
                         borderRadius: '50%',
                         backgroundColor: opcion.color,
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         color: 'white',
                         fontSize: '1rem'
                       }}
                     >
                       {opcion.icon}
                     </Box>
                   </ListItemIcon>
                   <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                          {opcion.nombre}
                        </Typography>
                      }
                    />
                 </MenuItem>
               ))}
             </Menu>
          </Box>
          
          <Search sx={{ display: { xs: 'none', sm: 'block' } }}>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <form onSubmit={handleSearchSubmit}>
              <StyledInputBase
                placeholder="Buscar…"
                inputProps={{ 'aria-label': 'search' }}
                value={searchValue}
                onChange={handleSearchChange}
              />
            </form>
          </Search>
          
          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1 }
          }}>
            <IconButton 
              size="large" 
              aria-label="toggle theme" 
              color="inherit"
              onClick={toggleDarkMode}
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <IconButton 
              size="large" 
              aria-label="show notifications" 
              color="inherit"
              sx={{ display: { xs: 'none', sm: 'flex' } }}
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton
              size="large"
              aria-label="configuración"
              color="inherit"
              onClick={() => handleSectionClick('configuracion')}
              sx={{ 
                display: { xs: 'none', sm: 'flex' },
                backgroundColor: currentSection === 'configuracion' ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <SettingsIcon />
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
              onClick={handleMenuOpen}
              sx={{
                mr: { xs: 0.5, sm: 0 },
                p: { xs: 1, sm: 1.5 }
              }}
            >
              <AccountCircle />
            </IconButton>
            
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={handleMenuClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: (theme) => theme.palette.mode === 'dark'
                    ? 'drop-shadow(0px 2px 8px rgba(0,0,0,0.6))'
                    : 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  minWidth: 200,
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  border: (theme) => theme.palette.mode === 'dark'
                    ? '1px solid rgba(255,255,255,0.1)'
                    : '1px solid rgba(0,0,0,0.1)',
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                    border: (theme) => theme.palette.mode === 'dark'
                      ? '1px solid rgba(255,255,255,0.1)'
                      : '1px solid rgba(0,0,0,0.1)',
                    borderRight: 'none',
                    borderBottom: 'none'
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText 
                  primary={`${user?.firstName} ${user?.lastName}`}
                  secondary={`${user?.usuario} - ${user?.rol}`}
                />
              </MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Cerrar Sesión" />
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280,
            backgroundColor: 'background.paper'
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ 
            backgroundColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.9)' : 'white',
            borderRadius: '8px',
            padding: '8px 12px',
            display: 'flex',
            alignItems: 'center',
            border: (theme) => theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.1)' : 'none'
          }}>
            <img 
              src="https://www.riojanaturepharma.com/assets/img/logo-big.png" 
              alt="RNP Logo" 
              style={{ 
                height: '32px', 
                width: 'auto',
                objectFit: 'contain'
              }} 
            />
          </Box>
          <IconButton onClick={handleDrawerToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />
        
        {/* Search in mobile */}
        <Box sx={{ p: 2 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            backgroundColor: 'action.hover',
            borderRadius: 1,
            px: 2,
            py: 1
          }}>
            <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <InputBase
              placeholder="Buscar…"
              value={searchValue}
              onChange={handleSearchChange}
              sx={{ flex: 1 }}
            />
          </Box>
        </Box>
        
        <List>
          {/* Navigation Items */}
          {navigationItems.map((item) => {
            if (item.id === 'departamentos') {
              return (
                <Box key={item.id}>
                  <ListItemButton 
                    onClick={handleDepartmentMobileToggle}
                    sx={{
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <ListItemIcon sx={{
                      color: currentSection === 'departamentos' ? '#1976d2' : 'inherit'
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      sx={{
                        color: currentSection === 'departamentos' ? '#1976d2' : 'inherit'
                      }}
                    />
                    {departmentMobileOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={departmentMobileOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {departamentos.map((dept) => (
                        <ListItemButton 
                          key={dept.id} 
                          sx={{ 
                            pl: 4,
                            '&:hover': {
                              backgroundColor: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(0, 0, 0, 0.04)'
                            }
                          }}
                          onClick={() => {
                            console.log('Departamento seleccionado:', dept.nombre);
                            handleMobileMenuClose();
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: dept.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.8rem'
                              }}
                            >
                              {dept.icon}
                            </Box>
                          </ListItemIcon>
                          <ListItemText primary={dept.nombre} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              );
            }
            if (item.id === 'captura') {
              return (
                <Box key={item.id}>
                  <ListItemButton 
                    onClick={handleCapturaMobileToggle}
                    sx={{
                      '&:hover': {
                        backgroundColor: (theme) => theme.palette.mode === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <ListItemIcon sx={{
                      color: currentSection === 'captura' ? '#1976d2' : 'inherit'
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.label}
                      sx={{
                        color: currentSection === 'captura' ? '#1976d2' : 'inherit'
                      }}
                    />
                    {capturaMobileOpen ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={capturaMobileOpen} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {capturaOpciones.map((opcion) => (
                        <ListItemButton 
                          key={opcion.id} 
                          sx={{ 
                            pl: 4,
                            '&:hover': {
                              backgroundColor: (theme) => theme.palette.mode === 'dark'
                                ? 'rgba(255, 255, 255, 0.08)'
                                : 'rgba(0, 0, 0, 0.04)'
                            }
                          }}
                          onClick={() => {
                            console.log('Opción de captura seleccionada:', opcion.nombre);
                            handleMobileMenuClose();
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 40 }}>
                            <Box
                              sx={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                backgroundColor: opcion.color,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.8rem'
                              }}
                            >
                              {opcion.icon}
                            </Box>
                          </ListItemIcon>
                          <ListItemText primary={opcion.nombre} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                </Box>
              );
            }
            return (
              <ListItemButton 
                key={item.id}
                selected={currentSection === item.id}
                onClick={() => {
                  handleSectionClick(item.id);
                  handleMobileMenuClose();
                }}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(25, 118, 210, 0.2)'
                      : 'rgba(25, 118, 210, 0.1)',
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.mode === 'dark'
                        ? 'rgba(25, 118, 210, 0.3)'
                        : 'rgba(25, 118, 210, 0.15)'
                    }
                  },
                  '&:hover': {
                    backgroundColor: (theme) => theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.08)'
                      : 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                <ListItemIcon sx={{
                  color: currentSection === item.id ? '#1976d2' : 'inherit'
                }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{
                    color: currentSection === item.id ? '#1976d2' : 'inherit'
                  }}
                />
              </ListItemButton>
            );
          })}
          
          <Divider sx={{ my: 2 }} />
          
          {/* User Actions in Mobile */}
          <ListItemButton 
            onClick={toggleDarkMode}
            sx={{
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ListItemIcon>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </ListItemIcon>
            <ListItemText primary={darkMode ? 'Modo Claro' : 'Modo Oscuro'} />
          </ListItemButton>
          
          <ListItemButton
            sx={{
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ListItemIcon>
              <NotificationsIcon />
            </ListItemIcon>
            <ListItemText primary="Notificaciones" />
          </ListItemButton>
          
          <ListItemButton
            onClick={() => {
              handleSectionClick('configuracion');
              handleMobileMenuClose();
            }}
            selected={currentSection === 'configuracion'}
            sx={{
              '&.Mui-selected': {
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(25, 118, 210, 0.2)'
                  : 'rgba(25, 118, 210, 0.1)',
                '&:hover': {
                  backgroundColor: (theme) => theme.palette.mode === 'dark'
                    ? 'rgba(25, 118, 210, 0.3)'
                    : 'rgba(25, 118, 210, 0.15)'
                }
              },
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <ListItemIcon sx={{
              color: currentSection === 'configuracion' ? '#1976d2' : 'inherit'
            }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText 
              primary="Configuración"
              sx={{
                color: currentSection === 'configuracion' ? '#1976d2' : 'inherit'
              }}
            />
          </ListItemButton>
          
          <Divider sx={{ my: 1 }} />
          
          <ListItem>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText 
              primary={`${user?.firstName} ${user?.lastName}`}
              secondary={`${user?.usuario} - ${user?.rol}`}
            />
          </ListItem>
          
          <ListItemButton 
            onClick={() => { logout(); handleMobileMenuClose(); }}
            sx={{
              '&:hover': {
                backgroundColor: (theme) => theme.palette.mode === 'dark'
                  ? 'rgba(244, 67, 54, 0.08)'
                  : 'rgba(244, 67, 54, 0.04)',
                '& .MuiListItemIcon-root, & .MuiListItemText-root': {
                  color: '#f44336'
                }
              }
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesión" />
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  );
};

export default Navbar;