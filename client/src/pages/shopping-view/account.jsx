import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

export default function ShoppingAccount() {
  return (
    <div className="flex flex-col">
      <div className="relative h-[370px] w-full overflow-hidden">
        <img
          src="/account.png"
          alt="Account Image"
          className="object-fill object-center w-full h-full"
        />
      </div>
      <div className="container grid grid-cols-1 gap-8 py-8 mx-auto">
        <div className="flex flex-col p-6 border rounded-lg shadow-sm bg-background">
          <Tabs defaultValue="orders">
            <TabsList>
              <TabsTrigger
                value="orders"
                className={`px-4 py-2 font-semibold hover:text-primary ${"data-[state=active]:bg-primary data-[state=active]:text-white"}`}
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="address"
                className={`px-4 py-2 font-semibold hover:text-primary ${"data-[state=active]:bg-primary data-[state=active]:text-white"}`}
              >
                Address
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
