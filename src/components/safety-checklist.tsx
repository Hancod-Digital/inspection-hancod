import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface SafetyChecklistProps {
  values: Record<string, string>;
  onChange: (name: string, value: string) => void;
}

export default function SafetyChecklist({ values, onChange }: SafetyChecklistProps) {
  return (
    <Table className="border-collapse [&_td]:border-b [&_th]:border-b mt-5 border rounded-lg">
      <TableBody>
        <ChecklistItem
          question="Is this first examination after installation or assembly at a new site or location"
          name="firstExamination"
          value={values.firstExamination || "no"}
          onChange={onChange}
        />
        <ChecklistItem
          question="Was the examination carried out: within an interval of 6 months"
          name="sixMonthInterval"
          value={values.sixMonthInterval || "no"}
          onChange={onChange}
        />
        <ChecklistItem
          question="Was the examination carried out: within an interval of 12 months"
          name="twelveMonthInterval"
          value={values.twelveMonthInterval || "no"}
          onChange={onChange}
        />
        <ChecklistItem
          question="If the answer to the above question is YES has the equipment been installed correctly"
          name="correctInstallation"
          value={values.correctInstallation || "no"}
          onChange={onChange}
        />
        <ChecklistItem
          question="In accordance with an examination scheme?"
          name="examinationScheme"
          value={values.examinationScheme || "no"}
          onChange={onChange}
        />
        <ChecklistItem
          question="After the occurrence of exceptional circumstances"
          name="exceptionalCircumstances"
          value={values.exceptionalCircumstances || "no"}
          onChange={onChange}
        />
        <ChecklistItem
          question="Is this equipment safe to use?"
          name="safeToUse"
          value={values.safeToUse || "no"}
          onChange={onChange}
        />
      </TableBody>
    </Table>
  )
}

interface ChecklistItemProps {
  question: string;
  name: string;
  value: string;
  onChange: (name: string, value: string) => void;
}

function ChecklistItem({ question, name, value, onChange }: ChecklistItemProps) {
  return (
    <TableRow>
      <TableCell className="font-medium border-r p-4">{question}</TableCell>
      <TableCell className="text-center border-r p-4">
        <RadioGroup value={value} onValueChange={(val) => onChange(name, val)} name={name} className="flex justify-center">
          <div className="flex items-center">
            <RadioGroupItem value="yes" id={`${name}-yes`} />
            <Label htmlFor={`${name}-yes`} className="sr-only">Yes</Label>
          </div>
        </RadioGroup>
      </TableCell>
      <TableCell className="text-center p-4">
        <RadioGroup value={value} onValueChange={(val) => onChange(name, val)} name={name} className="flex justify-center">
          <div className="flex items-center">
            <RadioGroupItem value="no" id={`${name}-no`} />
            <Label htmlFor={`${name}-no`} className="sr-only">No</Label>
          </div>
        </RadioGroup>
      </TableCell>
    </TableRow>
  )
}
