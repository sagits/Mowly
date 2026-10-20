/** Customer Search: past customers (claimed jobs), filtered by name. */
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useClaimedJobs } from '@mowly/api';
import { ListRow, TextField } from '@mowly/ui';

/** The Customer Search screen. */
export default function CustomersScreen() {
  const { data = [] } = useClaimedJobs();
  const [query, setQuery] = useState('');
  const rows = data.filter((j) => j.customerName.toLowerCase().includes(query.trim().toLowerCase()));
  return (
    <View testID="screen-customers" className="flex-1 bg-surface">
      <View className="p-4">
        <TextField label="Search" testID="customers-search" placeholder="Search past customers" value={query} onChangeText={setQuery} />
      </View>
      <ScrollView>
        {rows.map((j) => (
          <ListRow key={j.id} testID={`customer-${j.id}`} title={j.customerName} subtitle={j.address.line1} chevron={false} />
        ))}
      </ScrollView>
    </View>
  );
}
