import { View, Text, TouchableOpacity } from 'react-native'
import React, { memo } from 'react'
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { AI_SUGGESTIONS, CALORIE, AGE } from "../contants/Ai.contant"

interface AiChooseProps {
    onSuggestionPress: (text: string) => void;
}

const PremiumButton = ({ 
    item, 
    onPress, 
    isFullWidth = false,
    showSubtext = false
}: { 
    item: any, 
    onPress: () => void, 
    isFullWidth?: boolean,
    showSubtext?: boolean
}) => (
    <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className={`bg-white border border-gray-100 ${isFullWidth ? 'w-full' : 'w-[48%]'} p-4 rounded-3xl mb-4 shadow-sm flex-row items-center border-b-4 border-b-gray-200/50`}
        style={{ elevation: 3 }}
    >
        <View
            className="w-10 h-10 rounded-2xl items-center justify-center mr-3 shadow-inner"
            style={{ backgroundColor: (item.color || '#E07B39') + '15' }}
        >
            <MaterialCommunityIcons name={(item.icon || 'star') as any} size={22} color={item.color || '#E07B39'} />
        </View>
        <View className="flex-1">
            <Text className="text-gray-800 font-extrabold text-[12px] uppercase tracking-tight" numberOfLines={1}>
                {item.label}
            </Text>
            {showSubtext && (
                <Text className="text-gray-400 text-[9px] font-bold mt-0.5" numberOfLines={1}>
                    Xem gợi ý ngay
                </Text>
            )}
        </View>
        <MaterialCommunityIcons name="send-circle-outline" size={20} color={item.color || "#E07B39"} />
    </TouchableOpacity>
);

const SectionHeader = ({ icon, title, subtitle }: { icon: string, title: string, subtitle: string }) => (
    <View className="flex-row items-center mb-4 mt-2 px-1">
        <View className="w-8 h-8 bg-[#E07B39] rounded-xl items-center justify-center mr-3 shadow-sm">
            <MaterialCommunityIcons name={icon as any} size={18} color="white" />
        </View>
        <View>
            <Text className="text-sm font-black text-gray-800 uppercase tracking-tighter">
                {title}
            </Text>
            <Text className="text-[10px] text-gray-400 font-bold uppercase tracking-widest -mt-0.5">
                {subtitle}
            </Text>
        </View>
    </View>
);

const AiChoose = memo(({ onSuggestionPress }: AiChooseProps) => {
    return (
        <View className="bg-white/5 rounded-[40px] p-1">
            <View className="bg-white/90 p-5 rounded-[40px] border border-white shadow-xl">
                <View className="items-center mb-6">
                    <View className="w-12 h-1.5 bg-gray-200 rounded-full mb-4" />
                    <Text className="text-[#E07B39] font-black text-xs uppercase tracking-[4px]">Trợ lý AI Thông minh</Text>
                    <Text className="text-gray-400 text-[10px] font-bold mt-1">Chọn chủ đề bạn quan tâm bên dưới</Text>
                </View>


                <SectionHeader 
                    icon="star-face" 
                    title="Dành riêng cho bạn" 
                    subtitle="Gợi ý theo cảm hứng" 
                />
                <View className="flex-row flex-wrap justify-between mb-4">
                    {AI_SUGGESTIONS.map((item) => (
                        <PremiumButton 
                            key={item.label}
                            item={item} 
                            onPress={() => onSuggestionPress(item.label)} 
                            showSubtext
                        />
                    ))}
                </View>


                <SectionHeader 
                    icon="heart-pulse" 
                    title="Nhu cầu sức khỏe" 
                    subtitle="Lọc thực đơn theo năng lượng" 
                />
                <View className="flex-row flex-wrap justify-between mb-4">
                    {CALORIE.map((item) => (
                        <PremiumButton 
                            key={item.label}
                            item={item} 
                            onPress={() => onSuggestionPress(item.label)} 
                        />
                    ))}
                </View>


                <SectionHeader 
                    icon="human-male-female" 
                    title="Phù hợp lứa tuổi" 
                    subtitle="Tư vấn cho mọi thành viên" 
                />
                <View className="flex-row flex-wrap justify-between">
                    {AGE.map((item) => (
                        <PremiumButton 
                            key={item.label}
                            item={item} 
                            onPress={() => onSuggestionPress(item.label)} 
                        />
                    ))}
                </View>
                
                <View className="mt-6 pt-4 border-t border-gray-100 items-center">
                    <Text className="text-[10px] text-gray-300 font-bold uppercase tracking-widest text-center">
                         Nhấn vào biểu tượng để AI bắt đầu tư vấn
                    </Text>
                </View>
            </View>
        </View>
    )
});

export default AiChoose;