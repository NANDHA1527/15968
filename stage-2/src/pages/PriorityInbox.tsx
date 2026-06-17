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
        <CircularProgress sx={{ color: '#0ea5e9' }} />
      </Box>
    );
  }

  return (
    <Box className="page-enter" sx={{ p: { xs: 0, sm: 1 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold" sx={{ color: '#ffffff' }}>
            Priority Inbox
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Top ranked announcements based on placement urgency and recency.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 150, width: { xs: '100%', sm: 'auto' } }}>
          <InputLabel id="top-limit-label" sx={{ color: 'text.secondary' }}>Show Top</InputLabel>
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
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0ea5e9' }
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
        <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
          {prioritizedList.length === 0 ? (
            <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center', py: 4 }}>
              No notifications available in the Priority Inbox.
            </Typography>
          ) : (
            <List sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {prioritizedList.map((notif) => {
                const isRead = notif.isRead;
                
                // Set icons and colors based on Type
                let icon = <CampaignIcon sx={{ color: '#0ea5e9' }} />;
                let borderLeftColor = '#0ea5e9'; // Event default
                let typeColor: 'info' | 'success' | 'warning' = 'info';

                if (notif.type.toLowerCase() === 'placement') {
                  icon = <WorkIcon sx={{ color: '#10b981' }} />;
                  borderLeftColor = '#10b981';
                  typeColor = 'success';
                } else if (notif.type.toLowerCase() === 'result') {
                  icon = <AssessmentIcon sx={{ color: '#f59e0b' }} />;
                  borderLeftColor = '#f59e0b';
                  typeColor = 'warning';
                } else if (notif.type.toLowerCase() === 'event') {
                  icon = <EventIcon sx={{ color: '#0ea5e9' }} />;
                  borderLeftColor = '#0ea5e9';
                  typeColor = 'info';
                }

                return (
                  <ListItem
                    key={notif.id}
                    onClick={() => markAsViewed(notif.id)}
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      gap: { xs: 1.5, sm: 2 },
                      cursor: 'pointer',
                      borderRadius: '12px',
                      p: { xs: 1.5, sm: 2 },
                      transition: 'all 0.2s ease',
                      borderLeft: `5px solid ${isRead ? 'rgba(255,255,255,0.15)' : borderLeftColor}`,
                      background: isRead ? 'rgba(30, 41, 59, 0.4)' : 'rgba(30, 41, 59, 0.8)',
                      backdropFilter: 'blur(10px)',
                      borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      opacity: isRead ? 0.7 : 1,
                      boxShadow: isRead ? 'none' : '0 4px 12px rgba(0, 0, 0, 0.15)',
                      '&:hover': {
                        background: 'rgba(30, 41, 59, 0.95)',
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: { xs: 30, sm: 40 }, mt: 0.5 }}>
                      {icon}
                    </ListItemIcon>

                    <ListItemText
                      sx={{ m: 0 }}
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                          <Chip 
                            label={notif.type} 
                            size="small" 
                            color={typeColor}
                            variant={isRead ? 'outlined' : 'filled'}
                            sx={{ fontWeight: 'bold', height: 20, fontSize: '0.7rem' }} 
                          />
                          
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {notif.timestamp}
                          </Typography>

                          <Box sx={{ flexGrow: 1 }} />
                          
                          {/* Unread indicator */}
                          {!isRead && (
                            <Chip
                              icon={<CircleIcon sx={{ fontSize: '8px !important', color: '#ef4444' }} />}
                              label="Unread"
                              size="small"
                              sx={{
                                background: 'rgba(239, 68, 68, 0.1)',
                                color: '#ef4444',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                height: 18
                              }}
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'stretch', sm: 'flex-start' }, justifyContent: 'space-between', gap: 1.5 }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              color: isRead ? 'text.secondary' : 'text.primary',
                              fontWeight: isRead ? 'normal' : '500',
                              flex: 1,
                              lineHeight: 1.5
                            }}
                          >
                            {notif.message}
                          </Typography>

                          <Box sx={{ 
                            alignSelf: { xs: 'flex-start', sm: 'center' }, 
                            mt: { xs: 0.5, sm: 0 },
                            display: 'flex',
                            alignItems: 'center' 
                          }}>
                            {isRead ? (
                              <CheckCircleOutlineIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                            ) : (
                              <Typography variant="caption" sx={{ 
                                background: 'rgba(14, 165, 233, 0.1)',
                                padding: '3px 8px',
                                borderRadius: '6px',
                                border: '1px solid rgba(14, 165, 233, 0.2)',
                                color: '#0ea5e9',
                                fontWeight: 'bold',
                                whiteSpace: 'nowrap'
                              }}>
                                Score: {notif.priorityScore}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};
