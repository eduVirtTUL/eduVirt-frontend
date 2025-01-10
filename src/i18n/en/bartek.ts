const confirmationDialog = {
  no: "No",
  yes: "Yes",
};

const teamDetails = {
  leaveTeam: {
    button: "Leave Team",
    confirmHeader: "Leave Team",
    confirmText: "Are you sure you want to leave this team? This action cannot be undone.",
  },
  course: "Course:",
  status: "Status:",
  teamMembers: "Team Members",
  assignedPods: "Assigned Pods",
  noPods: "No pods assigned to this team",
  teamEmpty: "Team is empty",
  active: "Active",
  inactive: "Inactive",
};

const teamsList = {
  title: "Your Teams",
  table: {
    columns: {
      status: "Status",
      name: "Name",
      course: "Course",
    },
    active: "Active",
    inactive: "Inactive",
    noTeams: "No teams found",
  },
  viewDetails: "View details",
};

const podManagement = {
  title: "Stateful Pod Management - Team",
  resourceGroups: "Resource Groups",
  teamPods: "Team's Pods",
  createPod: "Create Pod",
  noPods: "No pods found",
  resourceGroup: "Resource Group",
  alerts: {
    hasAssociatedPod: "This Resource Group already has a pod associated with it",
    noVMs: "This Resource Group does not have any VMs.",
  },
  delete: {
    button: "Delete Pod",
    confirmHeader: "Delete Pod",
    confirmText: "Are you sure you want to delete this pod?",
  },
};

export default {
  confirmationDialog,
  teamDetails,
  teamsList,
  podManagement,
};
