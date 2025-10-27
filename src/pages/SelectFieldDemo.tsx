import TemplateSelectFieldConfig from '@/components/TemplateSelectFieldConfig';

export default function SelectFieldDemo(): JSX.Element {
  const handleSave = (config: any) => {
    console.log('Saved config:', config);
  };

  const handleCancel = () => {
    console.log('Cancelled');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <TemplateSelectFieldConfig
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  );
}
