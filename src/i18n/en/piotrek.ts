const clusters = {
  title: 'Clusters',
  table: {
    openMenu: 'Open menu',
    columns: {
      name: 'Name',
      description: 'Description',
      comment: 'Comment',
      hosts: 'Host count',
      vms: 'VM count',
    },
    viewLimits: 'Show cluster metrics',
    showIntervals: 'Show maintenance intervals',
  },
  details: {
    title: 'Cluster',
    table: {
      columns: {
        identifier: 'Identifier',
        description: 'Description',
        comment: 'Comment',
        cpuType: 'CPU type',
        compatibilityVersion: 'Compatibility version',
        threadsAsCores: 'Use threads as cores',
        maxMemoryOverCommit: 'Max memory over-commit',
      }
    },
    ovirt: {
      cluster: 'See the cluster in the oVirt system',
      network: 'See networks in the oVirt system',
      host: 'See cluster nodes in the oVirt system',
      event: 'Show cluster event logs in the oVirt system',
    },
    tabs: {
      details: 'Details',
      hosts: 'Hosts',
      network: 'Networks',
      metric: 'Metrics',
      event: 'Event log',
    }
  }
};

const hosts = {
  table: {
    columns: {
      name: 'Name',
      domainName: 'Address',
      cpuCount: 'CPU count',
      memorySize: 'RAM size'
    }
  }
};

const networks = {
  table: {
    columns: {
      name: 'Name',
      description: 'Description',
      comment: 'Comment',
      status: {
        name: 'Status',
        OPERATIONAL: 'Operational',
        NON_OPERATIONAL: 'Non-operational'
      }
    }
  }
};

const events = {
  table: {
    columns: {
      message: 'Message',
      severity: {
        name: 'Severity',
        NORMAL: 'Normal',
        WARNING: 'Warning',
        ERROR: 'Error',
        ALERT: 'Alert',
      },
      registeredAt: 'Registered at'
    }
  }
};

const metrics = {
  title: 'Metrics',
  table: {
    openMenu: 'Open menu',
    columns: {
      name: 'Name',
      category: 'Category'
    },
    delete: 'Delete',
  },
  add: 'Add',
  createMetric: {
    title: 'Create metric',
    name: 'Name',
    nameDescription: 'The metric name must be unique across all defined metrics.',
    category: 'Category',
    categoryDescription: 'The metric category defines the range of units available for the new metric when defining its value for course / cluster.',
    select: 'Choose metric category',
    success: 'The new metric was created successfully.',
    error: 'The new metric could not be created.'
  },
  removeMetric: {
    title: 'Remove metric',
    confirmation: {
      header: 'Are you sure you want to remove this metric?',
      text: 'Removing the specified metric will delete its defined values across clusters and courses. Do you want to continue?'
    },
    success: 'The metric was removed successfully.',
    error: 'The metric could not be removed.'
  },
  validation: {
    "name.too.short": 'The chosen metric name is too short.',
    "name.too.long": 'The chosen metric name is too long.',
    "name.invalid.format": 'The metric name can only contain alphanumeric characters and underscores.',
    "name.required": 'The metric name is required.',
    "category.empty": 'Please choose a category for the metric.'
  }
};

const clusterMetricValues = {
  table: {
    openMenu: 'Open menu',
    columns: {
      name: 'Name',
      value: 'Value',
      unit: 'Unit',
    },
    edit: 'Edit',
    delete: 'Delete',
  },
  add: 'Add',
  createClusterMetricValue: {
    title: 'Create new metric value',
    name: 'Name',
    nameDescription: 'This is the name of the metric for which the value will be defined.',
    value: 'Value',
    valueDescription: 'The unit value should not exceed the amount of resource available within the oVirt cluster.',
    unit: 'Unit of measurement',
    unitDescription: 'The measurement unit indicating the size of the defined metric value.',
    select: {
      name: 'Choose metric name',
      unit: 'Choose unit of measurement'
    },
    success: 'The metric value for the cluster was created successfully.',
    error: 'The metric value for the cluster could not be created.',
  },
  updateClusterMetricValue: {
    title: 'Change metric value',
    value: 'Metric value',
    valueDescription: 'The new metric value should not exceed the amount of resources available in the oVirt cluster.',
    unit: 'Unit of measurement',
    unitDescription: 'The measurement unit indicating the size of the new metric value.',
    select: {
      unit: 'Choose unit of measurement'
    },
    save: 'Save',
    success: 'The metric value for the cluster was updated successfully.',
    error: 'The metric value for the cluster could not be updated.',
  },
  removeClusterMetricValue: {
    confirmation: {
      header: 'Are you sure you want to delete the metric value?',
      text: 'Deleting the metric value is permanent. A new value can be defined for this metric. Do you want to continue?'
    },
    success: 'The metric value for the cluster was deleted successfully.',
    error: 'The metric value for the cluster could not be deleted.',
  },
  validation: {
    "value.negative": 'The metric value cannot be negative.',
    "metricId.required": 'Specify the metric for which the value is being created.',
    "unit.required": 'Choose a unit of measurement.',
  }
};

const maintenanceIntervals = {
  title: 'Management',
  altName: 'Maintenance intervals',
  system: {
    name: 'System',
    table: {
      openMenu: 'Open menu',
      columns: {
        cause: 'Cause',
        description: 'Description',
        start: 'Start',
        end: 'End',
      },
      remove: 'Remove',
      finish: 'Finish'
    },
  },
  cluster: {
    name: 'Cluster',
    title: 'Maintenance intervals for Cluster ',
    table: {
      openMenu: 'Open menu',
      columns: {
        cause: 'Cause',
        description: 'Description',
        type: 'Interval type',
        start: 'Start',
        end: 'End',
      },
      remove: 'Remove',
      finish: 'Finish'
    },
  },
  details: {
    title: {
      cluster: 'Maintenance intervals for cluster ',
      system: 'System Maintenance intervals'
    },
    id: 'Identifier',
    cause: 'Reason',
    description: 'Description',
    type: 'Type',
    clusterId: 'Cluster Identifier',
    beginAt: 'Start',
    endAt: 'End',
    actions: {
      delete: {
        name: 'Delete',
        title: 'Are you sure you want to delete the maintenance interval?',
        description: 'You will be able to define a new maintenance interval.'
      },
      finish: {
        name: 'Finish',
        title: 'Are you sure you want to finish the maintenance interval?',
        description: 'The maintenance interval will end immediately.'
      },
      cancel: 'Cancel'
    },
  },
  calendar: 'Calendar',
  active: 'Active maintenance interval',
  createMaintenanceInterval: {
    title: 'Create new maintenance interval',
    cause: 'Cause',
    causeDescription: 'A general reason for the maintenance interval.',
    startTime: 'Start',
    startTimeDescription: 'The start of the maintenance interval marks the moment when oVirt system functionalities will no longer be available.',
    description: 'Description',
    descriptionDescription: 'More detailed information about the reason for the maintenance interval.',
    duration: 'Interval duration (hours)',
    durationDescription: 'The duration of the interval in hours from the selected moment in the calendar during which the system functionality will be unavailable.',
    success: 'Maintenance interval created successfully',
    error: 'Failed to create maintenance interval',
  },
  removeMaintenanceInterval: {
    confirmation: {
      delete: {
        header: 'Are you sure you want to delete the maintenance interval?',
        text: 'Deleting maintenance interval is a permanent operation. Other intervals can be defined during its time window. Do you still want to proceed?'
      },
      finish: {
        header: 'Are you sure you want to finish the maintenance interval?',
        text: 'Finishing maintenance interval is a permanent operation. This will immediately end the selected maintenance interval. Do you still want to proceed?'
      }
    },
    success: 'Maintenance interval deleted successfully',
    error: 'Failed to delete maintenance interval',
  },
  validation: {
    "cause.too.short": 'The reason for the maintenance interval must be at least 4 characters long.',
    "cause.too.long": 'The reason for the maintenance interval cannot exceed 128 characters.',
    "cause.required": 'The reason for the maintenance interval is a required field.',
    "description.too.long": 'The description of the maintenance interval cannot exceed 256 characters.',
    "duration.too.short": 'The minimum downtime duration is 1 hour.',
  },
};

const courses = {
  title: 'Courses',
  table: {
    openMenu: 'Open menu',
    columns: {
      name: 'Name',
      description: 'Description',
    },
    showReservations: 'Show reservations'
  }
};

const reservations = {
  title: 'Reservations',
  altName: 'Reservations',
  calendar: {
    name: 'Calendar',
    team: 'Team',
    system: 'System maintenance intervals',
    cluster: 'Cluster maintenance intervals'
  },
  active: 'Active Reservations',
  table: {
    openMenu: 'Open menu',
    columns: {
      rgName: 'Resource group name',
      rgType: 'Resource group type',
      teamName: 'Team name',
      start: 'Reservation start',
      end: 'Reservation end',
    },
    stateless: 'Stateless',
    stateful: 'Stateful',
    showDetails: 'More Details',
  },
  ownReservations: 'View My Reservations',
  details: {
    title: 'Reservation ',
    tabs: {
      general: 'General Information',
      rg: 'Resource Group',
      events: 'Event Log',
    },
    general: {
      id: 'Reservation identifier',
      team: 'Team',
      teamId: 'Team identifier',
      teamButton: 'Go to team definition in the eduVirt system',
      teamName: 'Team name',
      rgId: 'Resource group identifier',
      rgButton: 'Go to resource group definition in the eduVirt system',
      rgName: 'Resource group name',
      rgState: 'Resource group state',
      start: 'Start',
      startInfo: 'The reservation start may be delayed due to resource startup. Estimated delay time: {{delayTime}} minutes.',
      end: 'End',
      endInfo: 'Due to the need to shut down resources in the resource group, the actual reservation end will occur earlier. Estimated advance time: {{delayTime}} minutes.',
      finishReservation: 'Finish reservation',
      removeReservation: 'Remove reservation',
      confirmation: {
        delete: {
          header: 'Are you sure you want to delete the reservation?',
          description: 'Deleting the reservation will not consume an attempt. It will be possible to create a new reservation in place of the deleted one. Do you want to continue?'
        },
        finish: {
          header: 'Are you sure you want to finish the current reservation?',
          description: 'Finishing the reservation will happen immediately. It will not be possible to recover the consumed attempt. Do you still want to continue?'
        }
      }
    },
    rg: {
      vmId: 'Virtual machine identifier',
      vmName: 'Virtual machine name',
      vmCpuCount: 'CPU Count',
      vmMemory: 'Memory',
      hidden: 'Hidden',
      ovirt: 'View virtual machine in oVirt'
    },
    events: {
      chosenVm: 'Virtual machine',
      chooseVm: 'Choose'
    }
  },
  createReservation: {
    title: 'Create New Reservation',
    startTime: 'Reservation start',
    startTimeDescription: 'The start of the reservation determines the approximate moment (depending on resource startup time) when the functionality provided by the oVirt system will become available.',
    duration: 'Reservation duration (hours)',
    durationDescription: 'The duration of the reservation, from the selected calendar moment, in hours.',
    automaticStartup: 'Automatically start resources within the POD',
    notificationTime: 'Notification time before reservation end (min)',
    notificationTimeDescription: 'Defines the time to send a notification about the upcoming end of the reservation before it actually ends. If 0 is chosen, no notification is sent.',
    success: 'Reservation created successfully',
    error: 'Failed to create reservation',
  },
  finishReservation: {
    success: 'Reservation finished successfully',
    error: 'Failed to finish reservation',
  },
  validation: {
    "duration.too.short": 'The selected reservation duration is too short.',
    "duration.too.long": 'The selected reservation duration exceeds the maximum reservation time.',
    "notificationTime.negative": 'The specified notification time is invalid.',
    "notificationTime.required": 'Notification time is required.',
    "notificationTime.too.long": 'The specified notification time exceeds half of the reservation duration.',
    "notificationTime.integer": 'Notification time must be expressed in whole minutes.',
    "endTime.beforeStart": 'The reservation must end after it starts.'
  },
};

export default {
  clusters, hosts, networks,
  metrics, events, courses,
  clusterMetricValues,
  maintenanceIntervals,
  reservations,
}