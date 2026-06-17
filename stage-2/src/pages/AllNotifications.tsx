import React, { useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip, Alert, useMediaQuery, useTheme } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';
import { useNotification } from '../hooks/useNotification';
import CampaignIcon from '@mui/icons-material/Campaign';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventIcon from '@mui/icons-material/Event';

export const AllNotifications: React.FC = () => {
  const { notifications, loading, error, markAsViewed } = useNotification();
  const [filterType, setFilterType] = useState<string>('ALL');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Filter list based on selected Type
  const filteredNotifications = useMemo(() => {
    if (filterType === 'ALL') return notifications;
    return notifications.filter(n => n.type.toUpperCase() === filterType);
  }, [notifications, filterType]);

  // Handle marking a row as viewed when clicked
  const handleRowClick = (params: any) => {
    markAsViewed(params.id as string);
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      renderCell: (params) => {
        const type = params.value as string;
        let color: 'info' | 'success' | 'warning' | 'default' = 'default';
        let icon = <CampaignIcon fontSize="small" />;
        
        if (type.toLowerCase() === 'placement') {
          color = 'success';
          icon = <WorkIcon fontSize="small" />;
        } else if (type.toLowerCase() === 'result') {
          color = 'warning';
          icon = <AssessmentIcon fontSize="small" />;
        } else if (type.toLowerCase() === 'event') {
          color = 'info';
          icon = <EventIcon fontSize="small" />;
        }

        return (
          <Chip
            icon={icon}
            label={type}
            color={color}
            variant="outlined"
            size="small"
            sx={{ fontWeight: 'bold' }}
          />
        );
      }
    },
    { field: 'message', headerName: 'Message', flex: 1, minWidth: 250 },
    { field: 'timestamp', headerName: 'Timestamp', width: 200 },
    {
      field: 'isRead',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => {
        const isRead = params.value as boolean;
        return (
          <Chip
            label={isRead ? 'Viewed' : 'Unread'}
            color={isRead ? 'default' : 'primary'}
            size="small"
            sx={{ 
              fontWeight: 'bold',
              background: isRead ? 'rgba(255,255,255,0.08)' : 'linear-gradient(45deg, #0ea5e9, #0d9488)',
              color: isRead ? '#aaaaaa' : '#ffffff'
            }}
          />
        );
      }
    }
  ];

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box className="page-enter" sx={{ p: { xs: 0, sm: 1 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#ffffff' }}>
            All Campus Notifications
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Browse and filter all academic and organizational announcements.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 200, width: { xs: '100%', sm: 'auto' } }}>
          <InputLabel id="filter-type-label" sx={{ color: 'text.secondary' }}>Filter by Type</InputLabel>
          <Select
            labelId="filter-type-label"
            id="filter-type-select"
            value={filterType}
            label="Filter by Type"
            onChange={(e) => setFilterType(e.target.value)}
            sx={{
              color: '#fff',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' }
            }}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            <MenuItem value="PLACEMENT">Placement</MenuItem>
            <MenuItem value="RESULT">Result</MenuItem>
            <MenuItem value="EVENT">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {isMobile ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredNotifications.length === 0 ? (
            <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
              No notifications matching this category.
            </Typography>
          ) : (
            filteredNotifications.map((notif) => {
              const isRead = notif.isRead;
              
              let icon = <CampaignIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />;
              let borderLeftColor = '#0ea5e9';
              let typeColor: 'info' | 'success' | 'warning' = 'info';

              if (notif.type.toLowerCase() === 'placement') {
                icon = <WorkIcon sx={{ color: '#10b981', fontSize: 20 }} />;
                borderLeftColor = '#10b981';
                typeColor = 'success';
              } else if (notif.type.toLowerCase() === 'result') {
                icon = <AssessmentIcon sx={{ color: '#f59e0b', fontSize: 20 }} />;
                borderLeftColor = '#f59e0b';
                typeColor = 'warning';
              } else if (notif.type.toLowerCase() === 'event') {
                icon = <EventIcon sx={{ color: '#0ea5e9', fontSize: 20 }} />;
                borderLeftColor = '#0ea5e9';
                typeColor = 'info';
              }

              return (
                <Card
                  key={notif.id}
                  onClick={() => markAsViewed(notif.id)}
                  sx={{
                    background: isRead ? 'rgba(30, 41, 59, 0.4)' : 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderLeft: `5px solid ${isRead ? 'rgba(255, 255, 255, 0.15)' : borderLeftColor}`,
                    borderRadius: '12px',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    opacity: isRead ? 0.7 : 1,
                    boxShadow: isRead ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                    '&:hover': {
                      background: 'rgba(30, 41, 59, 0.95)',
                      transform: 'translateX(4px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {icon}
                        <Chip
                          label={notif.type}
                          size="small"
                          color={typeColor}
                          variant={isRead ? 'outlined' : 'filled'}
                          sx={{ fontWeight: 'bold', height: 20, fontSize: '0.7rem' }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {notif.timestamp}
                        </Typography>
                        {!isRead && (
                          <Chip
                            label="Unread"
                            size="small"
                            sx={{
                              height: 18,
                              fontSize: '0.65rem',
                              fontWeight: 'bold',
                              background: 'rgba(239, 68, 68, 0.15)',
                              color: '#ef4444',
                              border: '1px solid rgba(239, 68, 68, 0.3)'
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isRead ? 'text.secondary' : 'text.primary',
                        fontWeight: isRead ? '400' : '500',
                        lineHeight: 1.5
                      }}
                    >
                      {notif.message}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      ) : (
        <Card sx={{ 
          background: 'rgba(255, 255, 255, 0.03)', 
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '16px',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
        }}>
          <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
            <Box sx={{ height: 500, width: '100%' }}>
              <DataGrid
                rows={filteredNotifications}
                columns={columns}
                loading={loading}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 10 },
                  },
                }}
                pageSizeOptions={[5, 10, 20]}
                onRowClick={handleRowClick}
                getRowClassName={(params) => 
                  params.row.isRead ? 'viewed-row' : 'unread-row'
                }
                sx={{
                  border: 'none',
                  color: '#ffffff',
                  '--DataGrid-rowBorderColor': 'rgba(255,255,255,0.06)',
                  '--DataGrid-containerBackground': 'transparent',
                  '& .MuiDataGrid-virtualScroller': {
                    scrollBehavior: 'smooth',
                    '&::-webkit-scrollbar': {
                      width: '8px',
                      height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: 'rgba(255, 255, 255, 0.01)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: 'rgba(14, 165, 233, 0.4)',
                    },
                  },
                  '& .MuiDataGrid-columnHeaders': {
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff'
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                    fontWeight: 'bold',
                  },
                  '& .MuiDataGrid-footerContainer': {
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#ffffff'
                  },
                  '& .MuiTablePagination-root': {
                    color: '#ffffff'
                  },
                  '& .MuiIconButton-root': {
                    color: '#ffffff'
                  },
                  '& .unread-row': {
                    cursor: 'pointer',
                    background: 'rgba(14, 165, 233, 0.02)',
                    fontWeight: '500',
                    '&:hover': {
                      background: 'rgba(14, 165, 233, 0.06)'
                    }
                  },
                  '& .viewed-row': {
                    cursor: 'pointer',
                    color: 'rgba(255,255,255,0.4)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.03)'
                    }
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};
