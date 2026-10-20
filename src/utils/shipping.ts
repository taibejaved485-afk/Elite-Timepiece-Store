// Mock shipping utility service
export interface ShippingStatus {
  orderId: string;
  carrier: string;
  statusBadge: string;
  currentStage: number; // 0-indexed: 0 = Atelier, 1 = Depot, 2 = Transit, 3 = Handoff
  stages: {
    title: string;
    completed: boolean;
    current?: boolean;
  }[];
}

export const getShippingStatus = (orderId: string): Promise<ShippingStatus> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        orderId,
        carrier: 'Malca-Amit Armored Air Transport',
        statusBadge: 'In Transit · Armored Security Escort',
        currentStage: 2,
        stages: [
          { title: 'Atelier Release', completed: true },
          { title: 'Depot Secured', completed: true },
          { title: 'In Transit', completed: false, current: true },
          { title: 'Hand Handoff', completed: false },
        ],
      });
    }, 800);
  });
};
