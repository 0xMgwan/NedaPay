import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Tabs,
  Tab,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardContent,
  Avatar,
  useTheme
} from '@mui/material';
import { 
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  CheckCircle,
  Cancel,
  Cancel as RejectIcon,
  FilterList as FilterIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Business as BusinessIcon,
  Badge as BadgeIcon
} from '@mui/icons-material';

// Mock KYC data
const mockKycData = [
  { 
    id: 2, 
    name: 'ABSA Bank', 
    type: 'Financial Institution', 
    submissionDate: '2025-04-05', 
    status: 'Rejected', 
    verifiedBy: 'Maria Johnson',
    verificationDate: '2025-04-06',
    documents: 3
  },
  { 
    id: 1, 
    name: 'CRDB Bank', 
    type: 'Financial Institution', 
    submissionDate: '2025-04-01', 
    status: 'Approved', 
    verifiedBy: 'John Smith',
    verificationDate: '2025-04-02',
    documents: 5
  },
  { 
    id: 2, 
    name: 'Tanzania Postal Bank', 
    type: 'Financial Institution', 
    submissionDate: '2025-04-02', 
    status: 'Pending', 
    verifiedBy: null,
    verificationDate: null,
    documents: 4
  },
  { 
    id: 3, 
    name: 'Exim Bank Tanzania', 
    type: 'Financial Institution', 
    submissionDate: '2025-04-03', 
    status: 'Pending', 
    verifiedBy: null,
    verificationDate: null,
    documents: 3
  },
  { 
    id: 4, 
    name: 'NMB Bank', 
    type: 'Financial Institution', 
    submissionDate: '2025-03-28', 
    status: 'Approved', 
    verifiedBy: 'Maria Johnson',
    verificationDate: '2025-03-30',
    documents: 5
  },
  { 
    id: 5, 
    name: 'Stanbic Bank', 
    type: 'Financial Institution', 
    submissionDate: '2025-03-25', 
    status: 'Rejected', 
    verifiedBy: 'Robert Chen',
    verificationDate: '2025-03-27',
    documents: 2,
    rejectionReason: 'Incomplete documentation'
  },
];

const KycManagement: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  
  // Filter KYC data based on tab
  const filteredKycData = mockKycData.filter(entity => {
    if (tabValue === 0) return true; // All
    if (tabValue === 1) return entity.status === 'Pending';
    if (tabValue === 2) return entity.status === 'Approved';
    if (tabValue === 3) return entity.status === 'Rejected';
    return true;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewDialogOpen = (entity: any) => {
    setSelectedEntity(entity);
    setOpenViewDialog(true);
  };

  const handleViewDialogClose = () => {
    setSelectedEntity(null);
    setOpenViewDialog(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'success';
      case 'Pending': return 'warning';
      case 'Rejected': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          KYC Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Verify and manage Know Your Customer (KYC) information for financial institutions and partners
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main, mr: 1 }}>
                  <PersonIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="medium">
                  Total Entities
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold">
                {mockKycData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.warning.main, mr: 1 }}>
                  <BadgeIcon />
                </Avatar>
                <Typography variant="h6" fontWeight="medium">
                  Pending
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="warning.main">
                {mockKycData.filter(entity => entity.status === 'Pending').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.success.main, mr: 1 }}>
                  <CheckCircle />
                </Avatar>
                <Typography variant="h6" fontWeight="medium">
                  Approved
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="success.main">
                {mockKycData.filter(entity => entity.status === 'Approved').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card 
            elevation={0} 
            sx={{ 
              borderRadius: 2,
              border: `1px solid ${theme.palette.divider}`,
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.error.main, mr: 1 }}>
                  <Cancel />
                </Avatar>
                <Typography variant="h6" fontWeight="medium">
                  Rejected
                </Typography>
              </Box>
              <Typography variant="h4" fontWeight="bold" color="error.main">
                {mockKycData.filter(entity => entity.status === 'Rejected').length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', width: '50%' }}>
          <TextField
            placeholder="Search entities..."
            variant="outlined"
            size="small"
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
          />
        </Box>
        <Box>
          <Button 
            startIcon={<FilterIcon />} 
            variant="outlined"
          >
            Filters
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label={`All (${mockKycData.length})`} />
          <Tab label={`Pending (${mockKycData.filter(entity => entity.status === 'Pending').length})`} />
          <Tab label={`Approved (${mockKycData.filter(entity => entity.status === 'Approved').length})`} />
          <Tab label={`Rejected (${mockKycData.filter(entity => entity.status === 'Rejected').length})`} />
        </Tabs>
      </Box>

      {/* KYC Table */}
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: `1px solid ${theme.palette.divider}` }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Entity Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Submission Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Verified By</TableCell>
              <TableCell>Verification Date</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredKycData.map((entity) => (
              <TableRow key={entity.id}>
                <TableCell component="th" scope="row">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <BusinessIcon sx={{ mr: 1, color: 'text.secondary' }} />
                    {entity.name}
                  </Box>
                </TableCell>
                <TableCell>{entity.type}</TableCell>
                <TableCell>{entity.submissionDate}</TableCell>
                <TableCell>
                  <Chip 
                    label={entity.status} 
                    color={getStatusColor(entity.status)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>{entity.verifiedBy || '-'}</TableCell>
                <TableCell>{entity.verificationDate || '-'}</TableCell>
                <TableCell align="center">
                  <Tooltip title="View Details">
                    <IconButton size="small" onClick={() => handleViewDialogOpen(entity)}>
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {entity.status === 'Pending' && (
                    <>
                      <Tooltip title="Approve">
                        <IconButton size="small" color="success">
                          <ApproveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton size="small" color="error">
                          <RejectIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* View KYC Details Dialog */}
      <Dialog open={openViewDialog} onClose={handleViewDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <BusinessIcon sx={{ mr: 1 }} />
            {selectedEntity?.name} - KYC Details
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEntity && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Entity Information
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Entity Name</Typography>
                  <Typography variant="body1">{selectedEntity.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Entity Type</Typography>
                  <Typography variant="body1">{selectedEntity.type}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Registration Number</Typography>
                  <Typography variant="body1">REG-{1000 + selectedEntity.id}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Tax ID</Typography>
                  <Typography variant="body1">TIN-{10000 + selectedEntity.id * 10}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  KYC Status
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip 
                    label={selectedEntity.status} 
                    color={getStatusColor(selectedEntity.status)} 
                    size="small" 
                  />
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Submission Date</Typography>
                  <Typography variant="body1">{selectedEntity.submissionDate}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Verified By</Typography>
                  <Typography variant="body1">{selectedEntity.verifiedBy || 'Not verified yet'}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Verification Date</Typography>
                  <Typography variant="body1">{selectedEntity.verificationDate || 'Not verified yet'}</Typography>
                </Box>
                {selectedEntity.status === 'Rejected' && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Rejection Reason</Typography>
                    <Typography variant="body1" color="error.main">{selectedEntity.rejectionReason}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Submitted Documents ({selectedEntity.documents})
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Document Type</TableCell>
                        <TableCell>Upload Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Business Registration Certificate</TableCell>
                        <TableCell>{selectedEntity.submissionDate}</TableCell>
                        <TableCell>
                          <Chip label="Verified" color="success" size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Tax Clearance Certificate</TableCell>
                        <TableCell>{selectedEntity.submissionDate}</TableCell>
                        <TableCell>
                          <Chip label="Verified" color="success" size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small">View</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Banking License</TableCell>
                        <TableCell>{selectedEntity.submissionDate}</TableCell>
                        <TableCell>
                          <Chip label="Verified" color="success" size="small" />
                        </TableCell>
                        <TableCell align="center">
                          <Button size="small">View</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleViewDialogClose}>Close</Button>
          {selectedEntity?.status === 'Pending' && (
            <>
              <Button variant="outlined" color="error" startIcon={<RejectIcon />}>
                Reject
              </Button>
              <Button variant="contained" color="success" startIcon={<ApproveIcon />}>
                Approve
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default KycManagement;
