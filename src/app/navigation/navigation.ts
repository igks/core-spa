import { FuseNavigation } from "@fuse/types";

export const navigation: FuseNavigation[] = [
    {
        id: "applications",
        title: "Applications",
        translate: "NAV.APPLICATIONS",
        type: "group",
        icon: "apps",
        children: [
            {
                id: "transactions",
                title: "Transactions",
                translate: "TRANSACTIONS",
                type: "collapsable",
                icon: "shopping_cart",
                children: [
                    {
                        id: "transaction1",
                        title: "Transaction 1",
                        type: "item",
                        url: "/transaction1",
                    },
                    {
                        id: "transaction2",
                        title: "Transaction 2",
                        type: "item",
                        url: "/transaction2",
                    },
                ],
            },
            {
                id: "reports",
                title: "Reports",
                translate: "REPORTS",
                type: "collapsable",
                icon: "receipt",
                children: [
                    {
                        id: "report1",
                        title: "Report 1",
                        type: "item",
                        url: "/report1",
                    },
                    {
                        id: "report2",
                        title: "Report 2",
                        type: "item",
                        url: "/report2",
                    },
                ],
            },
            {
                id: "masters",
                title: "Masters",
                translate: "MASTERS",
                type: "collapsable",
                icon: "dashboard",
                children: [
                    {
                        id: "department",
                        title: "Department",
                        type: "item",
                        url: "/pages/master/department",
                    },
                ],
            },
        ],
    },
];
