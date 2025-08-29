import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Stack,
  Chip,
  Switch,
  FormControlLabel,
  LinearProgress,
  IconButton,
  Grid,
  Divider
} from '@mui/material';
import {
  Close as CloseIcon,
  Update as UpdateIcon,
  Schedule as ScheduleIcon,
  Info as InfoIcon
} from '@mui/icons-material';

const UpdateNotification = ({ isVisible, version, notes, onDismiss, onUpdate }) => {
  const [countdown, setCountdown] = useState(10);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(false);

  useEffect(() => {
    if (!isVisible || !autoUpdateEnabled) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          // Auto-update functionality would go here
          // For now, just reset countdown
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isVisible, autoUpdateEnabled]);

  return (
    <Dialog 
      open={isVisible} 
      onClose={onDismiss}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Card elevation={0}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box display="flex" alignItems="center" gap={1}>
                <InfoIcon color="primary" />
                <Typography variant="h6" component="h3">
                  Nueva Versión Disponible
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="caption" color="text.secondary">
                  {new Date().toLocaleString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={onDismiss}
                  sx={{ ml: 1 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            {version && (
              <Box mb={3}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Versión
                      </Typography>
                      <Box mt={0.5}>
                        <Chip label={version?.version || version} color="success" size="small" />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                        Proyecto
                      </Typography>
                      <Box mt={0.5}>
                        <Chip label="React App" color="primary" size="small" />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                {notes && (
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      {notes}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            <Box mb={3}>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Actualización Automática
                  </Typography>
                  {autoUpdateEnabled && (
                    <Box display="flex" alignItems="center" gap={1}>
                      <ScheduleIcon fontSize="small" color="primary" />
                      <Typography variant="body2" color="text.secondary">
                        Se actualizará en {countdown} segundos
                      </Typography>
                    </Box>
                  )}
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoUpdateEnabled}
                      onChange={(e) => {
                        setAutoUpdateEnabled(e.target.checked);
                        if (e.target.checked) setCountdown(10);
                      }}
                      color="primary"
                    />
                  }
                  label=""
                  sx={{ m: 0 }}
                />
              </Box>

              {autoUpdateEnabled && (
                <Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(11 - countdown) * 10}
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              )}
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CloseIcon />}
                onClick={onDismiss}
              >
                Descartar
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<UpdateIcon />}
                onClick={onUpdate}
              >
                Actualizar
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateNotification;