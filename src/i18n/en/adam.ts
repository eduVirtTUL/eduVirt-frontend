const courseLimits = {
  title: "Metrics",
  table: {
    openMenu: "Open menu",
    columns: {
      name: "Name",
      value: "Value",
    },
    edit: "Edit",
    delete: "Delete",
  },
  deleteCourseMetric: {
    title: "Are you sure you want to delete this metric?",
    description: "Metric will be permanently deleted. You can readd it later.",
    success: "Metric has been deleted",
    error: "Failed to delete metric",
  },
  createCourseMetricValue: {
    title: "Create metric value",
    metric: "Metric",
    select: "Select metric",
    value: "Value",
    create: "Create metric value",
    success: "Metric value has been added successfully",
    error: "Failed to add metric value",
  },
  add: "Add metric",
  editCourseMetricValue: {
    title: "Edit metric value",
    value: "Value",
    save: "Save",
    success: "Metric value has been updated",
    error: "Failed to update metric value",
  },
  validation: {
    metricRequired: "Metric is required",
    valueMustBeGraterOrEqualZero: "Value must be greater or equal zero",
  },
};

const createResourceGroupPoolModal = {
  title: "Create resource group pool",
  name: "Name*",
  maxRent: "Max rent count*",
  maxRentDescription:
    "Specifies the maximum number of rents for a resource group from the pool.",
  maxRentDescription2: "Set to 0 to allow unlimited rents.",
  gracePeriod: "Grace period*",
  gracePeriodDescription:
    "Specifies the grace period for a resource group from the pool.",
  gracePeriodDescription2:
    "Set to 0:00 hours to allow immediate rent after the previous one ends.",
  course: "Course*",
  create: "Create",
  success: "Resource group pool has been created",
  error: "Failed to create resource group pool",
  validation: {
    nameRequired: "Name is required",
    nameMaxLength: "Name cannot be longer than 50 characters",
    maxRentGreaterOrEqualZero: "Max rent count must be greater or equal zero",
    gracePeriodGreaterOrEqualZero: "Grace period must be greater or equal zero",
    courseRequired: "Course is required",
    descriptionRequired: "Description is required",
    descriptionMaxLength: "Description cannot be longer than 1000 characters",
    maxRentTimeGreaterOrEqualZero:
      "Max rent time must be greater or equal zero",
  },
  selectCourse: "Select course",
  noCourses: "No courses",
  searchCourses: "Search courses",
  maxRentTime: "Max rent time*",
  maxRentTimeDescription:
    "Specifies the maximum time for which a resource group can be rented.",
  maxRentTimeDescription2: "Set to 0:00 hours to allow unlimited rent time.",
  description: "Description",
};

const rentTimeSelector = {
  title: "Select rent time",
};

const resourceGroupPoolPage = {
  title: "Resource group pools",
  poolSettings: "Pool settings",
  resourceGroups: "Resource groups",
  createResourceGroup: "Create resource group",
  delete: "Delete",
  deleteConfirmation:
    "Are you sure you want to delete this resource group pool?",
  deleteConfirmationText:
    "The resource group pool will be deleted. All resource groups assigned to this pool will also be deleted. This operation cannot be undone.",
  deleteSuccess: "Resource group pool has been deleted",
  deleteError: "Failed to delete resource group pool",
  fields: {
    name: "Name",
    course: "Course",
    description: "Description",
    maxRent: "Max rent count",
    gracePeriod: "Grace period",
    maxRentTime: "Max rent time",
  },
  type: "Resource group pool",
  openEditor: "Open editor",
  calendar: "Reservations",
};

const createResourceGroupModal = {
  titleStateless: "Create stateless resource group",
  titleStateful: "Create stateful resource group",
  name: "Name*",
  maxRentTime: "Max rent time",
  description: "Description",
  success: "Resource group has been created",
  error: "Failed to create resource group",
  descriptionInPoolWarning:
    "The created resource group will be assigned a description from the resource group pool",
  maxRentTimeInPoolWarning:
    "The created resource group will be assigned a max rent time from the resource group pool.",
  maxRentTimeDescription:
    "Specifies the maximum time for which a resource group can be rented.",
  maxRentTimeDescription2: "Set to 0:00 hours to allow unlimited rent time.",
  validation: {
    nameRequired: "Name is required",
    nameMaxLength: "Name cannot be longer than 50 characters",
    descriptionMaxLength: "Description cannot be longer than 1000 characters",
    maxRentTimeGreaterOrEqualZero:
      "Max rent time must be greater or equal zero",
  },
};

const coursePage = {
  title: "Course",
  details: "Details",
  edit: "Edit",
  delete: "Delete",
  reset: "Reset",
  limits: "Metrics",
  description: "Description",
  externalLink: "External link",
  deleteAction: {
    success: "Course has been deleted",
    error: "Failed to delete course",
    confirmation: "Are you sure you want to delete this course?",
    confirmationText:
      "The course will be deleted. All resource groups assigned to this course will also be deleted. This operation cannot be undone.",
  },
  updateAction: {
    success: "Course has been updated",
    error: "Failed to update course",
  },
  resetAction: {
    confirmation: "Are you sure you want to reset this course?",
    confirmationText:
      "All teams, pods, and reservations will be deleted. Resource groups and pools will remain unchanged. This operation cannot be undone.",
    success: "Course has been reset",
    error: "Failed to reset course",
  },
};

const courseStatefulResourceGroups = {
  title: "Stateful resource groups",
  createResourceGroup: "Create resource group",
  openEditor: "Open editor",
  calendar: "Reservations",
  noGroups: "No resource groups",
  noGroupsDescription:
    "This course does not have any stateful resource groups.",
};

const coursePools = {
  title: "Resource group pools",
  createPool: "Create pool",
  openPool: "Open pool",
  noPools: "No resource group pools",
  noPoolsDescription: "This course does not have any resource group pools.",
};

const editResourceGroupPoolModal = {
  title: "Edit resource group pool",
  button: "Edit",
  success: "Resource group pool has been updated",
  error: "Failed to update resource group pool",
};

const resourceGroupEditor = {
  type: "Resource group",
  addVirtualMachine: "Add virtual machine",
  edit: "Edit",
  delete: "Delete",
  privateSegments: {
    button: "Private segments",
    title: "Manage private segments",
    description:
      "Private segments allow creating internal networks within the resource group.",
    createSegment: "Create segment",
    name: "Name",
    placeholder: "Segment name...",
    create: "Create",
    segments: "Segments",
    interfaces: "NICs",
    actions: "Actions",
    delete: "Delete",
    deleteConfirmation: "Are you sure you want to delete this segment?",
    deleteConfirmationText:
      "The segment will be deleted. This operation cannot be undone. All network interfaces assigned to this segment will be detached.",
    deleteSuccess: "Segment has been deleted",
    deleteError: "Failed to delete segment",
  },
  virtualMachinesList: {
    title: "Virtual machines",
    hidden: "Hidden",
    cpu: "vCPU",
    memory: "MiB",
    interfaces: "NICs",
    edit: "Edit",
    ovirt: "oVirt",
    noMachines: "The group does not contain virtual machines",
  },
  interfaceList: {
    title: "Interfaces",
    selectVirtualMachine: "Select virtual machine",
    noInterfaces: "No interfaces",
    public: "Public",
    private: "Private",
    mac: "MAC:",
    segment: "Segment:",
    detach: "Detach",
    profile: "Profile:",
    conflict: "Conflict",
    conflictTooltip:
      "This interface is assigned both a network profile and a private segment. This conflict must be manually resolved by detaching the interface from one of them.",
    detachConfirmationHeader: "Are you sure you want to detach this interface?",
    detachConfirmationText:
      "This operation will detach the interface from the network. The virtual machine will lose connection to this network. You can reattach the interface later. Do you want to continue?",
    attach: "Attach",
    attachTitle: "Attach interface to private segment",
    selectPrivateSegment: "Select private segment",
  },
  deleteResourceGroup: {
    confirmation: "Are you sure you want to delete this resource group?",
    confirmationText:
      "The resource group will be deleted. All virtual machines assigned to this resource group will be deleted. This operation cannot be undone.",
    success: "Resource group has been deleted",
    error: "Failed to delete resource group",
  },
  updateResourceGroup: {
    success: "Resource group has been updated",
    error: "Failed to update resource group",
  },
  attachNetwork: {
    success: "Interface has been attached",
    error: "Failed to attach interface",
    segment: "Segment*",
  },
  detachNetwork: {
    success: "Interface has been detached",
    error: "Failed to detach interface",
    confirmation: "Are you sure you want to detach this interface?",
    confirmationText:
      "This operation will detach the interface from the network. The virtual machine will lose connection to this network. You can reattach the interface later. Do you want to continue?",
  },
  addNetwork: {
    success: "Interface has been added",
    error: "Failed to add interface",
  },
  deleteNetwork: {
    success: "Interface has been deleted",
    error: "Failed to delete interface",
  },
  addVm: {
    success: "Virtual machine has been added",
    error: "Failed to add virtual machine",
  },
};

const addVmModal = {
  title: "Add virtual machine to resource group",
  searchPlaceholder: "Search virtual machine...",
  hidden: "Hidden",
  hiddenDescription: "Hidden virtual machines will not be visible to students.",
  noVirtualMachines: "No virtual machines",
  noVirtualMachinesDescription:
    "No virtual machines matching the search criteria were found. Make sure the machine you are looking for is in the correct cluster.",
};

const removeVmModal = {
  confirmation: "Are you sure you want to delete this virtual machine?",
  confirmationText:
    "The virtual machine will be removed from the resource group. This operation cannot be undone.",
  success: "Virtual machine has been deleted",
  error: "Failed to delete virtual machine",
};

const editVmModal = {
  title: "Edit virtual machine",
  hidden: "Hidden",
  hiddenDescription: "Hidden virtual machines will not be visible to students.",
  success: "Virtual machine has been updated",
  error: "Failed to update virtual machine",
};

const resourceGroupPools = {
  title: "Resource group pools",
  createPool: "Create pool",
  table: {
    name: "Name",
    course: "Course",
    resourceGroups: "Resource groups",
  },
  filters: {
    searchPlaceholder: "Search resource group pools...",
    clear: "Clear",
    selectCourse: "Select course",
    noCourses: "No courses",
    searchCourse: "Search courses",
  },
};

const resourceGroups = {
  title: "Resource groups",
  table: {
    name: "Name",
    type: "Type",
    stateless: "Stateless",
    stateful: "Stateful",
  },
};

const editResourceGroupModal = {
  title: "Edit resource group",
  name: "Name*",
  description: "Description",
  maxRentTime: "Max rent time*",
  descriptionInPoolWarning:
    "Stateless resource group has a description from the resource group pool",
  maxRentTimeInPoolWarning:
    "Stateless resource group has a max rent time from the resource group pool",
  validation: {
    nameRequired: "Resource group name is required",
    nameMaxLenght: "Resource group name cannot be longer than 50 characters",
    descriptionMaxLenght:
      "Resource group description cannot be longer than 1000 characters",
    maxRentTimeGreaterOrEqualZero:
      "Max rent time must be greater or equal zero",
  },
};

const editCourseModal = {
  title: "Edit course",
  name: "Name*",
  externalLink: "External link",
  description: "Description",
  validation: {
    nameRequired: "Course name is required",
    descriptionRequired: "Course description is required",
    nameMaxLenght: "Course name cannot be longer than 50 characters",
    descriptionMaxLenght:
      "Course description cannot be longer than 1000 characters",
    externalLinkMaxLenght:
      "External link cannot be longer than 1000 characters",
    externalLinkShouldBeUrl: "External link should be a valid URL",
  },
};

const courseListPage = {
  title: "Courses",
  searchPlaceholder: "Search course...",
  clear: "Clear",
  createCourse: "Create course",
  table: {
    name: "Name",
    description: "Description",
    details: "Details",
    edit: "Edit",
  },
};

const createCourseModal = {
  title: "Create new course",
  name: "Name*",
  description: "Description",
  cluster: "Cluster*",
  selectCluster: "Select cluster",
  externalLink: "External link",
  teacherEmail: "Teacher's email address",
  validation: {
    nameRequired: "Course name is required",
    nameMaxLenght: "Course name cannot be longer than 50 characters",
    descriptionMaxLenght:
      "Course description cannot be longer than 1000 characters",
    clusterRequired: "Cluster is required",
    externalLinkMaxLenght:
      "External link cannot be longer than 1000 characters",
    externalLinkShouldBeUrl: "External link should be a valid URL",
    teacherEmail: "Please provide a valid teacher's email address",
  },
  success: "Course has been created",
  error: "Failed to create course",
};

export default {
  courseLimits,
  createResourceGroupPoolModal,
  rentTimeSelector,
  resourceGroupPoolPage,
  createResourceGroupModal,
  editResourceGroupPoolModal,
  courseStatefulResourceGroups,
  coursePools,
  coursePage,
  resourceGroupEditor,
  addVmModal,
  removeVmModal,
  editVmModal,
  editResourceGroupModal,
  editCourseModal,
  courseListPage,
  createCourseModal,
  resourceGroupPools,
  resourceGroups,
};
