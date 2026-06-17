import React, { useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem, Chip, Alert } from '@mui/material';
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
              background: isRead ? 'rgba(255,255,255,0.08)' : 'linear-gradient(45deg, #1976d2, #00d5ff)',
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
    <Box className="page-enter" sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#ffffff' }}>
          All Campus Notifications
        </Typography>

        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel id="filter-type-label" sx={{ color: '#aaa' }}>Filter by Type</InputLabel>
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
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00e5ff' }
            }}
          >
            <MenuItem value="ALL">All Categories</MenuItem>
            <MenuItem value="PLACEMENT">Placement</MenuItem>
            <MenuItem value="RESULT">Result</MenuItem>
            <MenuItem value="EVENT">Event</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
                  background: 'rgba(0, 229, 255, 0.02)',
                  fontWeight: '500',
                  '&:hover': {
                    background: 'rgba(0, 229, 255, 0.06)'
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
    </Box>
  );
};
