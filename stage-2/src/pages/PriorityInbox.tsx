import React, { useState, useMemo } from 'react';
import { Box, Typography, Card, CardContent, FormControl, InputLabel, Select, MenuItem, List, ListItem, ListItemIcon, ListItemText, Chip, CircularProgress, Alert } from '@mui/material';
import { useNotification } from '../hooks/useNotification';
import CampaignIcon from '@mui/icons-material/Campaign';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EventIcon from '@mui/icons-material/Event';
import CircleIcon from '@mui/icons-material/Circle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

export const PriorityInbox: React.FC = () => {
  const { notifications, loading, error, markAsViewed } = useNotification();
  const [topN, setTopN] = useState<number>(10);

  // Compute the top N priority notifications
  const prioritizedList = useMemo(() => {
    return [...notifications]
      .sort((a, b) => {
        // Primary sort: Priority Score Descending (dominates because of weight * 1,000,000)
        return b.priorityScore - a.priorityScore;
      })
      .slice(0, topN);
  }, [notifications, topN]);

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Box>
    );
  }

  if (loading && notifications.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress sx={{ color: '#00e5ff' }} />
      </Box>
    );
  }

  return (
    <Box className="page-enter" sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#ffffff' }}>
            Priority Inbox
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 0.5 }}>
            Top ranked announcements based on placement urgency and recency.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel id="top-limit-label" sx={{ color: '#aaa' }}>Show Top</InputLabel>
          <Select
            labelId="top-limit-label"
            id="top-limit-select"
            value={topN}
            label="Show Top"
            onChange={(e) => setTopN(Number(e.target.value))}
            sx={{
              color: '#fff',
              '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.15)' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.3)' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00e5ff' }
            }}
          >
            <MenuItem value={10}>Top 10</MenuItem>
            <MenuItem value={15}>Top 15</MenuItem>
            <MenuItem value={20}>Top 20</MenuItem>
            <MenuItem value={25}>Top 25</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Card sx={{ 
        background: 'rgba(255, 255, 255, 0.02)', 
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)'
      }}>
        <CardContent sx={{ p: 2 }}>
          {prioritizedList.length === 0 ? (
            <Typography variant="body1" sx={{ color: '#aaa', textAlign: 'center', py: 4 }}>
              No notifications available in the Priority Inbox.
            </Typography>
          ) : (
            <List sx={{ width: '100%', p: 0 }}>
              {prioritizedList.map((notif, index) => {
                const isRead = notif.isRead;
                
                // Set icons and colors based on Type
                let icon = <CampaignIcon sx={{ color: '#00e5ff' }} />;
                let borderLeftColor = '#90caf9'; // Event default
                let typeColor: 'info' | 'success' | 'warning' = 'info';

                if (notif.type.toLowerCase() === 'placement') {
                  icon = <WorkIcon sx={{ color: '#00e676' }} />;
                  borderLeftColor = '#00e676';
                  typeColor = 'success';
                } else if (notif.type.toLowerCase() === 'result') {
                  icon = <AssessmentIcon sx={{ color: '#ffb74d' }} />;
                  borderLeftColor = '#ffb74d';
                  typeColor = 'warning';
                } else if (notif.type.toLowerCase() === 'event') {
                  icon = <EventIcon sx={{ color: '#29b6f6' }} />;
                  borderLeftColor = '#29b6f6';
                  typeColor = 'info';
                }

                return (
                  <React.Fragment key={notif.id}>
                    <ListItem
                      onClick={() => markAsViewed(notif.id)}
                      sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' },
                        gap: 2,
                        cursor: 'pointer',
                        borderRadius: '12px',
                        mb: index === prioritizedList.length - 1 ? 0 : 1.5,
                        p: 2,
                        transition: 'all 0.2s ease',
                        borderLeft: `6px solid ${isRead ? 'rgba(255,255,255,0.1)' : borderLeftColor}`,
                        background: isRead ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                        opacity: isRead ? 0.6 : 1,
                        boxShadow: isRead ? 'none' : '0 4px 15px rgba(0, 0, 0, 0.2)',
                        '&:hover': {
                          background: isRead ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)',
                          transform: 'translateX(4px)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap', mb: 0.5 }}>
                            <Chip 
                              label={notif.type} 
                              size="small" 
                              color={typeColor}
                              variant={isRead ? 'outlined' : 'filled'}
                              sx={{ fontWeight: 'bold', height: 20, fontSize: '0.75rem' }} 
                            />
                            
                            <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                              {notif.timestamp}
                            </Typography>

                            <Box sx={{ flexGrow: 1 }} />
                            
                            {/* Unread indicator */}
                            {!isRead && (
                              <Chip
                                icon={<CircleIcon sx={{ fontSize: '8px !important', color: '#ff1744' }} />}
                                label="Unread"
                                size="small"
                                sx={{
                                  background: 'rgba(255, 23, 68, 0.1)',
                                  color: '#ff1744',
                                  fontSize: '0.7rem',
                                  fontWeight: 'bold',
                                  border: '1px solid rgba(255, 23, 68, 0.2)'
                                }}
                              />
                            )}
                          </Box>
                        }
                        secondary={
                          <Typography 
                            variant="body1" 
                            sx={{ 
                              color: isRead ? 'rgba(255, 255, 255, 0.5)' : '#ffffff',
                              fontWeight: isRead ? 'normal' : '500' 
                            }}
                          >
                            {notif.message}
                          </Typography>
                        }
                      />

                      <Box sx={{ alignSelf: { xs: 'flex-end', sm: 'center' } }}>
                        {isRead ? (
                          <CheckCircleOutlineIcon sx={{ color: 'rgba(255,255,255,0.3)' }} />
                        ) : (
                          <Typography variant="caption" sx={{ 
                            background: 'rgba(255,255,255,0.05)',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#00e5ff',
                            fontWeight: 'bold'
                          }}>
                            Score: {notif.priorityScore}
                          </Typography>
                        )}
                      </Box>
                    </ListItem>
                  </React.Fragment>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
