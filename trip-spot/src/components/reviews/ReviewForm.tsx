import { FormAlert, FormField } from "../../components/common/FormField";
import { RatingStars } from "../../components/common/RatingStars";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { useForm } from "../../hooks/useForm";
import type { ReviewDto } from "../../types";
import { validateReview } from "../../utils/validators";

const EMPTY: ReviewDto = { text: "", rating: 0 };

export function ReviewForm({
  onSubmit,
}: {
  onSubmit: (dto: ReviewDto) => Promise<void>;
}) {
  const form = useForm<ReviewDto>(
    EMPTY as ReviewDto,
    validateReview,
    async (v) => {
      await onSubmit(v);
      // eslint-disable-next-line react-hooks/immutability
      form.reset();
    },
  );

  return (
    <form
      onSubmit={form.handleSubmit}
      noValidate
      className="space-y-4 rounded-2xl border bg-card p-5"
    >
      <h3 className="text-xl">Остави ревю</h3>
      <FormAlert message={form.submitError} />
      <FormField id="rating" label="Оценка" error={form.errors.rating}>
        <RatingStars
          size="md"
          value={form.values.rating as number}
          onChange={(n) => form.setField("rating", n)}
        />
      </FormField>
      <FormField id="text" label="Твоето преживяване" error={form.errors.text}>
        <Textarea
          id="text"
          name="text"
          rows={3}
          value={form.values.text as string}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
        />
      </FormField>
      <Button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? "Публикуване…" : "Публикувай"}
      </Button>
    </form>
  );
}
