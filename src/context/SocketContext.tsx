import { useSelector, useDispatch } from 'react-redux'
import { io, Socket } from 'socket.io-client'
import { RootState, AppDispatch } from '../service/redux/store'
import { userLogout } from '../service/redux/slices/userAuthSlice'
import { deliveryBoyLogout } from '../service/redux/slices/deliveryBoySlice'
import { showNotification, hideNotification } from '../service/redux/slices/notificationSlice'
import { useNavigate } from 'react-router-dom'
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react'
import { adminLogout } from '../service/redux/slices/adminSlice'
import { restaurantLogout } from '../service/redux/slices/restaurantSlice'
import { toast } from 'sonner'


interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
})

export const useSocket = (): SocketContextType => useContext(SocketContext)

interface SocketContextProps {
    children: ReactNode;
}

const SOCKET_URL = import.meta.env.VITE_API_GATEWAY_URL_SOCKET

export const SocketProvider: React.FC<SocketContextProps> = ({ children }) => {
    console.log('=================== SocketProvider Initilized =================');
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()

    const { user, admin, restaurant, deliveryBoy, role } = useSelector((state: RootState) => ({
        user: state.userAuth,
        admin: state.adminAuth,
        restaurant: state.restaurantAuth,
        deliveryBoy: state.deliveryBoyAuth,
        role: state.userAuth.role || state.adminAuth.role || state.deliveryBoyAuth.role || state.restaurantAuth.role
    }))

    console.log('socket provider state :', {
        userId: user.user_id,
        adminId: admin.admin_id,
        deliveryBoyId: deliveryBoy.delivery_boy_id,
        restaurantId: restaurant.restaurant_id,
        role
    });

    const [socket, setSocket] = useState<Socket | null>(null)
    const [isConnected, setIsConnected] = useState<boolean>(false)

    useEffect(() => {
        const activeRole = [user.role, deliveryBoy.role, restaurant.role, admin.role].filter(Boolean).length

        if (activeRole > 1) {
            console.log('multiple roel detected.Logging Out');
            dispatch(userLogout());
            dispatch(deliveryBoyLogout());
            dispatch(restaurantLogout())
            dispatch(adminLogout())
            navigate('/login')
            return
        }

        let id: string | undefined;
        let token: string | null = null;
        let refreshToken: string | null = null;

        if (role === 'User') {
            id = user.user_id
            token = localStorage.getItem('userToken')
            refreshToken = localStorage.getItem('refreshToken')
        } else if (role === 'Admin') {
            id = admin.admin_id
            token = localStorage.getItem('adminToken')
            refreshToken = localStorage.getItem('adminRefreshToken')
        } else if (role === 'DeliveryBoy') {
            id = deliveryBoy.delivery_boy_id
            token = localStorage.getItem('deliveryBoyToken')
            refreshToken = localStorage.getItem('deliveryBoyRefreshToken')
        } else if (role === 'Restaurant') {
            id = restaurant.restaurant_id
            token = localStorage.getItem('restaurantToken')
            refreshToken = localStorage.getItem('restaurantRefreshToken')
        }

        if (!id || !role || !SOCKET_URL || !token) {
            console.log('Missing the id,role,SOCKET_URL or token.Disconncetd socket.');
            if (socket) {
                socket.disconnect()
                setSocket(null)
                setIsConnected(false)
            }
            return
        }
        // console.log(`Establishing socket connection for ${role} with id: ${id}`);
        const newSocket = io(SOCKET_URL, {
            query: { token, refreshToken },
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        // console.log('new socket :', newSocket);

        setSocket(newSocket);

        newSocket.on("connect", () => {
            console.log(`${role} is connected the socket: ${id}`);
            setIsConnected(true)
            newSocket.emit('register', { userId: id, role })
        })

        newSocket.on("tokens-updated", ({ token, refreshToken }) => {
            console.log("Tokens updated:", { role, token, refreshToken });
            if (role === "User") {
                localStorage.setItem("userToken", token);
                localStorage.setItem("refreshToken", refreshToken);
            } else if (role === "Admin") {
                localStorage.setItem("adminToken", token);
                localStorage.setItem("adminRefreshToken", refreshToken);
            } else if (role === "DeliveryBoy") {
                localStorage.setItem("deliveryBoyToken", token);
                localStorage.setItem("deliveryBoyRefreshToken", refreshToken);
            } else if (role === "Restaurant") {
                localStorage.setItem("restaurantToken", token);
                localStorage.setItem("restaurantRefreshToken", refreshToken);
            }
        });

        newSocket.on("error", (error: string) => {
            console.error("Socket error:", error);
            setIsConnected(false);
            dispatch(showNotification({ type: "error", message: `Socket error: ${error}` }));
        });

        newSocket.on("disconnect", () => {
            console.log(`${role} socket disconnected: ${id}`);
            setIsConnected(false);
        });

        newSocket.on("user-blocked", () => {
            console.log(`User-blocked event received for ${role}: ${id}`);
            dispatch(
                showNotification({
                    type: "admin-blocked",
                    message: "Your account has been blocked by an admin.",
                    navigate: "/login",
                })
            );
            if (role === "User") {
                dispatch(userLogout());
            } else if (role === "Admin") {
                dispatch(adminLogout());
            } else if (role === "DeliveryBoy") {
                dispatch(deliveryBoyLogout());
            } else if (role === 'Restaurant') {
                dispatch(restaurantLogout())
            }
            navigate("/login");
        });

        newSocket.on("order-created", (data: { orderId: string, restaurantId: string }) => {
            console.log(`Order-Created event received for ${role}:${id} with data:`, JSON.stringify(data));
            console.log('Dispatching showNotification with payload:', {
                type: 'order-created',
                message: 'User has ordered new food items. Please check it out.',
                data,
            });
            dispatch(
                showNotification({
                    type: 'order-created',
                    message: 'User has ordered new food items. Please check it out.',
                    data: data,
                })
            );
        });

        newSocket.on('delivery-order-notification', (data: { orderId: string; restaurantId: string; restaurantDetails: any }) => {
            if (role === 'DeliveryBoy') {
                console.log(`Delivery order notification received for deliveryBoy: ${id}`, JSON.stringify(data));
                dispatch(
                    showNotification({
                        type: 'delivery-order-notification',
                        message: `New delivery order available from ${data.restaurantDetails.restaurantName}!`,
                        data: {
                            orderId: data.orderId,
                            restaurantId: data.restaurantId,
                            restaurantDetails: data.restaurantDetails,
                        },
                    })
                );
            }
        });

        newSocket.on('delivery-boy-accepted', (data: { orderId: string; deliveryBoyId: string }) => {
            if (role === 'DeliveryBoy' && data.deliveryBoyId !== id) {
                console.log(`Order ${data.orderId} accepted by another delivery boy: ${data.deliveryBoyId}`);
                dispatch(hideNotification());
                toast.info('Order was accepted by another delivery partner.');
            }
        });

     

        return () => {
            console.log(`Cleaning up socket for ${role}: ${id}`);
            newSocket.off("connect");
            newSocket.off("tokens-updated");
            newSocket.off("error");
            newSocket.off("user-blocked");
            newSocket.off('delivery-order-notification');
            newSocket.off('delivery-boy-accepted');
            newSocket.disconnect();
            setSocket(null);
            setIsConnected(false);
        };

    }, [user.user_id, admin.admin_id, deliveryBoy.delivery_boy_id, restaurant.restaurant_id, role, dispatch, navigate])

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    )
}