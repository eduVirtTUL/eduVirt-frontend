import { ErrorKey } from "@/data/privateAxios";
import piotrek from "./piotrek";
import {Language, Role} from "@/stores/userStore";

const menu = {
    courses: "Courses",
    networks: "Networks",
    metrics: "Metrics",
    reservations: "Reservations",
    teams: "Teams",
    resourceGroups: "Resource groups",
    resourceGroupPools: "Resource group pools",
    home: "Main page",
    limits: "Limits",
    maintenance: "Management",
    signOut: "Sign out",
    theme: {
        dark: "Dark",
        light: "Light",
        system: "System",
        title: "Theme",
    },
    languages: {
        title: "Language",
        pl: "Polish",
        en: "English",
    },
    accessLevel: {
        title: "Access level",
        administator: "Administrator",
        teacher: "Teacher",
        student: "Student",
    },
};

const roles = {
    administrator: "Administrator",
    teacher: "Teacher",
    student: "Student",
} satisfies { [key in Role]: string };

const languages = {
    pl: "Polish",
    en: "English",
} satisfies { [key in Language]: string }

const general = {
    yes: "Yes",
    no: "No",
    page: "Page",
    next: "Next",
    previous: "Previous",

    error: {
        "not.authorized": "You do not have required privileges to see this page.",
        "operation.not.implemented": "This operation is not yet implemented.",
        "connection.open.error": "Some error occurred while trying to connect to oVirt engine instance.",
        "constraint.violation.exception": "Specified data does not match constraints",
        "optimistic.lock.exception": "Error occurred. Try once again!",
        "internal.server.error": "Some error occurred during processing of the request. Try again later.",
    },
};

const units = {
    memory: {
        name: "Memory",
        units: {
            mebibytes: {name: "Mebibytes", symbol: "MiB"},
            gibibytes: {name: "Gibibytes", symbol: "GiB"},
            tebibytes: {name: "Tebibytes", symbol: "TiB"},
        }
    },
    countable: {
        name: "Countable",
        units: {
            pieces: {
                name: "Pieces",
                symbol: "pcs"
            }
        }
    }
};

const errorKeys = {
    "course.not.found": "Course not found",
    noNetworkAvailable: "The number of networks has been restricted by the course, no networks are available",
    "courseLimits.error.value.already.defined": "The course has the value for this metric already defined",
    "courseLimits.error.value.not.defined": "The course does not have values defined for this metric",
    "resource.group.not.found": "Resource group not found",
    "resource.group.pool.not.found": "Resource group pool not found",
    courseAlreadyExists: "A course with the given name already exists",
    courseConflict: "You are not working with the latest data. Please refresh the page",
    courseMetricNetworksNotSufficient: "The course contains an item with more networks than the metric value allows.",
    rgAlreadyExists: "A resource group with the given name already exists",
    resourceGroupConflict: "You are not working with the latest data. Please refresh the page",
    resourceGroupPoolAlreadyExists: "A resource group pool with the given name already exists",
    rgPoolConflict: "You are not working with the latest data. Please refresh the page",
    virtualMachineAlreadyExists: "A virtual machine with the given name already exists",
    virtualMachineClusterMismatch: "The virtual machine is located in a different cluster than the course cluster",
    vmConflict: "You are not working with the latest data. Please refresh the page",

    "clusters.error.not.found": "The selected cluster was not found",
    "metrics.error.not.found": "The metric was not found",
    "metrics.error.delete.exception": "The metric could not be deleted",
    "metrics.error.name.already.taken": "The selected metric name is already in use",
    "clusterMetricValues.error.value.not.defined": "The metric value for the cluster has not yet been defined",
    "clusterMetricValues.error.value.already.defined": "The metric value for the cluster has already been defined",
    "maintenanceIntervals.error.not.found": "The selected maintenance interval was not found",
    "maintenanceIntervals.error.invalid.time.window": "The start of the maintenance interval must occur before its end",
    "maintenanceIntervals.error.begin.too.early": "The maintenance interval must be scheduled with at least six hours' notice",
    "maintenanceIntervals.error.conflict": "Other maintenance intervals already exist within the selected time frame",
    "maintenanceIntervals.error.already.finished": "The selected maintenance interval has already concluded",

    "reservations.error.not.found": "The selected reservation was not found",
    "reservations.error.conflict": "Other reservations already exist within the selected time frame",
    "reservations.error.end.before.start": "The end of the reservation must occur after its start",
    "reservations.error.start.in.past": "Reservations cannot begin in the past",
    "reservations.error.too.short": "The minimum reservation duration in the eduVirt system is twice the length of the minimum time window",
    "reservations.error.creation.error": "An error occurred while creating the reservation",
    "reservations.error.maintenance.interval.conflict": "Maintenance intervals are defined during the planned reservation period",
    "reservations.error.course.resources.insufficient": "Course resources are insufficient to create a new reservation",
    "reservations.error.cluster.resources.insufficient": "Cluster resources are insufficient to create a new reservation",
    "reservations.error.max.length.exceeded": "The maximum reservation length has been exceeded",
    "reservations.error.grace.period.not.finished": "The grace period from the last reservation must elapse",
    "reservations.error.grace.period.could.not.finish": "The grace period of the planned reservation would overlap with another reservation",
    "reservations.error.resource.group.already.reserved": "The specified resource group is already reserved",
    "reservations.error.notification.time.too.long": "The notification time for the end of the reservation cannot exceed half the reservation duration",
    "reservations.error.reservation.count.exceeded": "The reservation limit for the given POD has been reached",
    "reservations.error.stateful.pod.not.assigned": "The selected stateful POD is not assigned to your team",
    "reservations.error.stateless.pod.not.assigned": "The selected stateless POD is not assigned to your team",

    networkAlreadyExists: "A network with the given name already exists",
} satisfies { [key in ErrorKey]: string };

const notFoundPage = {
    title: "Page not found",
    description: "Page, that you are looking for, does not exist. Check URL address.",
    back: "Go back to the main page",
};

const pageTitles = {
    courses: "Courses - eduVirt",
    course: "Course - eduVirt",
    resourceGroups: "Resource groups - eduVirt",
    resourceGroup: "Resource group - eduVirt",
    resourceGroupPools: "Resource group pools - eduVirt",
    resourceGroupPool: "Resource group pool - eduVirt",
    courseMetrics: "Course - Metrics - eduVirt",
    teams: 'Teams - eduVirt',
    team: 'Team - eduVirt',
    metrics: 'Metrics - eduVirt',
    clusters: 'Clusters - eduVirt',
    reservations: 'Reservations - eduVirt',
    reservationCalendar: 'Reservation calendar - eduVirt',
    maintenanceCalendar: 'Maintenance intervals calendar - eduVirt',
    maintenanceInterval: 'Maintenance interval - eduVirt',
    maintenanceIntervals: 'Maintenance intervals - eduVirt',
    clusterMetricValues: 'Cluster - Metrics - eduVirt',
    login: "Log into eduVirt",
    notFound: "Page not found",
    courseTeams: "Teams from course {{courseName}} - eduVirt",
    vlansRanges: "VLAN ranges - eduVirt",
    vnicProfiles: "Private segments - eduVirt",
};

export default {
    save: "Save",
    cancel: "Cancel",
    next: "Next",
    previous: "Previous",
    create: "Create",
    yes: "Yes",
    no: "No",
    add: "Add",
    join: "Join",
    close: "Close",
    status: "Status",
    noResults: "No results",
    requiredFieldDescription: "(*) - field value required",
    houres: "h",
    genericError: "Some error occurred!",
    loginUsingSSO: "Login using oVirt SSO",
    menu,
    units,
    general,
    errorKeys,
    languages,
    roles,
    notFoundPage,
    pageTitles,
    ...piotrek,
};
